fire_data = d3.csv("data/fires_hectars.csv")
air_quality_data = d3.csv("data/air_quality_CO.csv")
temperature_data = d3.csv("data/annual_avg_temp_renewed.csv")
emissions_data = d3.csv("data/emissions_totals_renewed.csv")

fire = "Fire"
air_quality = "Air Quality"
temperature = "Temperature"
emissions = "Emissions"

fireColor = "#f05d5d"
airQColor = "#d3a2e8"
tempColor = "#ffd86b"
emiColor = "#8acf99"

main_data = air_quality

isUpdate = false

var svg_line_chart = 0
var svg_parallel_coordinates = 0
var x_line,y_line,xAxis,yAxis,sumstat, all_lines;
var selectedButtonColor ="#ba8fff";

const margin = {top: 10, right: 50, bottom: 30, left: 50},
  width = 800 - margin.left - margin.right,
  height = 350 - margin.top - margin.bottom;

  if (main_data=="Air Quality" && !isUpdate){
    lineColor = airQColor;
    line_chart(air_quality_data);
  } 
  else if (main_data=="Fire"){
    lineColor = fireColor;
    line_chart(fire_data);
  }
  else if (main_data=="Temperature"){
    lineColor = tempColor;
    line_chart(temperature_data);
  }
  else if (main_data=="Emissions"){
    lineColor = emiColor;
    line_chart(emissions_data);
  }

  d3.csv("data/mergedAverages.csv").then((data) =>{
    parallelCoordinatesBrush(data);
  })
  .catch((error) =>{
      console.log(error);
  });
  draw = false;

  Promise.all([d3.json("data/countries.json"), d3.csv("data/annual_avg_temp_renewed.csv")]).then(function ([map, data]){
    topology = map;
    dataset = data;
    gen_geo_map();
});


function gen_geo_map(){
  var year = '2018';

  var year_data = dataset.find(c => c.Year === year) ;
  console.log(year_data);
  
  let colorScale = d3
      .scaleLinear()
      .domain([d3.min(dataset, (d) => d.Value), d3.max(dataset, (d) => d.Value)]).range([0, 1]);


  var projection = d3
      .geoMercator()
      .scale(height)
      .rotate([0,0])
      .center([10, 32])
      .translate([width/2, height]);

  var path = d3.geoPath().projection(projection);


  d3.select("#map")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .selectAll("path")
      .data(topojson.feature(topology, topology.objects.europe).features)
      .join("path")
      .attr("class", "country")
      .attr("d", path)
      .attr("id", function(d, i){
          return d.properties.name;
      })
      .attr("fill", function (d){
          var country = dataset.find(c => c.Country === d.properties.name)  
          if(country){
              var colorVal = colorScale(country.Value);
              return d3.interpolateYlOrBr(colorVal);
          }    
          else{
              return "gray";
      }})
      .append("title")
      .text( function (d){
          return d.properties.name;
      })
}

function parallelCoordinatesBrush(data){
  var height;
  var keys;
  var margin = ({top: 30, right: 10, bottom: 30, left: 10});
  var width = 500 - margin.left - margin.right;
  var brushHeight = 40;


  keys = data.columns.slice(1);
  height = keys.length * 70;
  //x = new Map(Array.from(keys, key => [key, d3.scaleLinear(d3.extent(data, d => d[key]), [margin.left, width - margin.right])]))
  var x = {}
  for (i in keys) {
    n = keys[i]
    if(n =='Fires'){
      x[n] = d3.scaleLinear()
      .domain( d3.extent(data, function(d) { return +d[n]; }) )
      .range([margin.left, width]);
    }
    else{
      x[n] = d3.scaleLinear()
      .domain( d3.extent(data, function(d) { return +d[n]; }) )
      .range([margin.left, width]);
    }
  }

  y = d3.scalePoint(keys, [margin.top, height]);
   
  var deselectedColor = "#77777a";
  label = d => d.name;

  line = d3.line()
    .defined(([, value]) => value != null)
    .x(([key, value]) => x[key](value))
    .y(([key]) => y(key));
    
  const svg = d3.select("#parallelCoordinates")
                .append("svg")
                .style("width", width+20)
                .style("height", height+20);

  const brush = d3.brushX()
      .extent([
        [margin.left, -(brushHeight / 2)],
        [width - margin.right, brushHeight / 2]
      ])
      .on("start brush end", brushed);

  const path = svg.append("g")
      .attr("fill", "none")
      .attr("stroke-width", 1.5)
      .attr("stroke-opacity", 0.4)
    .selectAll("path")
    .data(data)
    .join("path")
      .attr("stroke", "#639eeb")
      .attr("d", d => line(d3.cross(keys, [d], (key, d) => [key, d[key]])));


    svg.append("g")
    .selectAll("g")
    .data(keys)
    .join("g")
      .attr("transform", d => `translate(0,${y(d)})`)
      .each(function(d) { 
        d3.select(this)
          .call(d3.axisBottom(x[d])); 
      })
      .call(g => g.select('.domain')
        .attr("stroke","white")
        .attr("stroke-width","1.5"))
      .call(g => g.append("text")
        .attr("x", margin.left)
        .attr("y", -6)
        .attr("text-anchor", "start")
        .attr("fill", "white")
        .style("width", width)
        .text(d => d))
      .call(g => g.selectAll('.tick')
        .attr("color", "white")
      )
      .call(brush);

  const selections = new Map();

  function brushed({selection}, key) {
    if (selection === null) selections.delete(key);
    else selections.set(key, selection.map(x[key].invert));
    const selected = [];
    path.each(function(d) {
      const active = Array.from(selections).every(([key, [min, max]]) => d[key] >= min && d[key] <= max);
      d3.select(this).style("stroke", active ? "#639eeb" : deselectedColor);
      if (active) {
        d3.select(this).raise();
        selected.push(d);
      }
    });
  }
}

function update(data) {
  main_data = data
  isUpdate = true
  
  if (main_data=="Air Quality"){
    line_chart(air_quality_data);
    lineColor = airQColor;
  } 
  else if (main_data=="Fire"){
     line_chart(fire_data);
     lineColor = fireColor;
  }

  else if (main_data=="Emissions"){
    line_chart(emissions_data);
    lineColor = emiColor;
  }

  else if (main_data=="Temperature"){
    line_chart(temperature_data);
    lineColor = tempColor;
  }
}

function line_chart(data) {

  if (isUpdate){
    isUpdate=false

    data.then( function(data) {
      sumstat = d3.group(data, d => d.Country);
      svg_line_chart = d3.select("div#line_chart")
      
      x_line.domain([d3.min(data, function(d) { return d.Year }), d3.max(data, function(d) { return d.Year }) ]);
      svg_line_chart.selectAll(".myXaxis").transition()
      .duration(1000)
      .call(d3.axisBottom(x_line))
      .call(g => g.selectAll('.tick')
        .attr("color", "white")
      );

      y_line.domain([d3.min(data, function(d) { return +d.Value; }), d3.max(data, function(d) { return +d.Value  }) ]);
      svg_line_chart.selectAll(".myYaxis")
        .transition()
        .duration(1000)
        .call(d3.axisLeft(y_line))
        .call(g => g.selectAll('.tick')
        .attr("color", "white")
      );
      
      svg_line_chart
      .selectAll(".line")
      .data(sumstat)
      .join(
        (enter) => {
          return enter
          .append("path")
          .attr("class","line")
          .attr("fill", "none")
          .attr("stroke", "steelblue")
          .attr("stroke-width", 1.5)
          .attr("d", function(d){
            return d3.line()
              .x(function(d) { return x_line(d["Year"]); })
              .y(function(d) { return y_line(+d["Value"]); })
              (d[1])
          })
        },
        (update) => {
          update
            .transition()
            .duration(750)
            .attr("d", function(d){
              return d3.line()
                .x(function(d) { return x_line(d["Year"]); })
                .y(function(d) { return y_line(+d["Value"]); })
                (d[1])
            }).attr("stroke", lineColor);
        },
        (exit) => {
          return exit.remove();
        }
      );
    })
  }

  else{
    //Read the data
  data.then( function(data) {

    const sumstat = d3.group(data, d => d.Country);

    svg_line_chart = d3.select("div#line_chart")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height +  margin.bottom)
    .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
  
    x_line = d3.scaleLinear()
      //.domain([new Date(1990, 0, 1),new Date(2020, 0, 1)])
      .domain(d3.extent(data, function(d) { return d.Year;}))
      .range([ 0, width ]);

    svg_line_chart.append("g")
      .attr("transform", `translate(0, ${height})`)
      .attr("class","myXaxis")
      .call(d3.axisBottom(x_line).ticks(21))
      .call(g => g.select('.domain')
        .attr("stroke","white")
        .attr("stroke-width","1.5"))
      .call(g => g.selectAll('.tick')
        .attr("color", "white")
      );

    // Add Y axis
    y_line = d3.scaleLinear()
    .domain([d3.min(data, function(d) { return +d.Value; }), d3.max(data, function(d) { return +d.Value; })])
      .range([ height, 0 ]);

    svg_line_chart.append("g")
      .attr("class","myYaxis")
      .call(d3.axisLeft(y_line))
      .call(g => g.select('.domain')
        .attr("stroke","white")
        .attr("stroke-width","1.5"))
      .call(g => g.selectAll('.tick')
        .attr("color", "white")
      );


    // Initialize line with group a
    svg_line_chart.selectAll(".line")
      .data(sumstat)
      .join("path")
        .attr("class","line")
        .attr("fill", "none")
        .attr("stroke", lineColor)
        .attr("stroke-width", 1.5)
        .attr("d", function(d){
          return d3.line()
            .x(function(d) { return x_line(d["Year"]); })
            .y(function(d) { return y_line(+d["Value"]); })
            (d[1])
        })
    
  })
  }


}
