fire_data = d3.csv("data/fires_hectars.csv")
air_quality_data = d3.csv("data/air_quality_CO.csv")
temperature_data = d3.csv("data/annual_avg_temp_renewed.csv")
emissions_data = d3.csv("data/emissions_totals_renewed.csv")

fire = "Fire"
air_quality = "Air Quality"

main_data = air_quality
draw = true

function init(){
  //if (main_data=="Air Quality") line_chart(air_quality_data);
  //else if (main_data=="Fire") line_chart(fire_data);

  if(draw){
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
    
  }
}

function updateData(data_name) {
  main_data = data_name
  init()
}

function updateData_air_quality(svg) {
  lineChart_air_quality()
}

function gen_geo_map(){
  var height = 380;
  var margin = ({top: 30, right: 10, bottom: 30, left: 10});
  var width = 700 - margin.left - margin.right;
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
              return d3.interpolateBuPu(colorVal);
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
  var keys;
  var height;
  var margin = ({top: 30, right: 10, bottom: 30, left: 10});
  var width = 500 - margin.left - margin.right;
  var brushHeight = 40;


  keys = data.columns.slice(1);
  height = keys.length * 80;
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
   
  var deselectedColor = "#ddd";
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
      .attr("stroke", "steelblue")
      .attr("d", d => line(d3.cross(keys, [d], (key, d) => [key, d[key]])));


    svg.append("g")
    .selectAll("g")
    .data(keys)
    .join("g")
      .attr("transform", d => `translate(0,${y(d)})`)
      .each(function(d) { d3.select(this).call(d3.axisBottom(x[d])); })
      .call(g => g.append("text")
        .attr("x", margin.left)
        .attr("y", -6)
        .attr("text-anchor", "start")
        .attr("fill", "currentColor")
        .style("width", width)
        .text(d => d))
      .call(g => g.selectAll("text")
        .clone(true).lower()
        .attr("fill", "none")
        .attr("stroke-width", 5)
        .attr("stroke-linejoin", "round")
        .attr("stroke", "white"))
      .call(brush);

  const selections = new Map();

  function brushed({selection}, key) {
    if (selection === null) selections.delete(key);
    else selections.set(key, selection.map(x[key].invert));
    const selected = [];
    path.each(function(d) {
      const active = Array.from(selections).every(([key, [min, max]]) => d[key] >= min && d[key] <= max);
      d3.select(this).style("stroke", active ? "steelblue" : deselectedColor);
      if (active) {
        d3.select(this).raise();
        selected.push(d);
      }
    });
  }
}

function line_chart(data) {

// set the dimensions and margins of the graph
const margin = {top: 10, right: 100, bottom: 30, left: 50},
  width = 1000 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#line_chart")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

/* WE HAVE TO BUILD THE BUTTON OUTSIDE CSV FUNCTION IN ORDER TO CHOOSE WHICH DATASET WE'RE GONNA READ
 WHEN WE CHOOSE A CERTAIN BUTTON, WE CHANGE THE DATASET AND BUILD ANOTHER LINE CHART RELATIVELY TO THE METRIC SELECTED
const allMetrics = ["Air Quality","Emissions","Fires","Temperature"]
// add the options to the button
d3.select("#selectButton")
  .selectAll('myOptions')
  .data(allMetrics)
  .enter()
  .append('option')
  .text(function (d) { return d; }) // text showed in the menu
  .attr("value", function (d) { return d; }) // corresponding value returned by the button
*/

//Read the data
data.then( function(data) {

  const sumstat = d3.group(data, d => d.Country);
  // A color scale: one color for each group
  //const myColor = d3.scaleOrdinal()
  //  .domain(allGroup)
  //  .range(d3.schemeSet2);
  // Add X axis --> it is a date format
  const x = d3.scaleLinear()
    //.domain([new Date(1990, 0, 1),new Date(2020, 0, 1)])
    .domain(d3.extent(data, function(d) { return d.Year;}))
    .range([ 0, width ]);
    svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(21));

  // Add Y axis
  const y = d3.scaleLinear()
  .domain([0, d3.max(data, function(d) { return +d.Value; })])
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Initialize line with group a
  svg.selectAll(".line")
    .data(sumstat)
    .join("path")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", function(d){
        return d3.line()
          .x(function(d) { return x(d["Year"]); })
          .y(function(d) { return y(+d["Value"]); })
          (d[1])
      })
  // A function that update the chart
})

}
