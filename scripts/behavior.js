fire_data = d3.csv("data/fires_hectars.csv")
air_quality_data = d3.csv("data/air_quality_CO.csv")
temperature_data = d3.csv("data/annual_avg_temp_renewed.csv")
emissions_data = d3.csv("data/emissions_totals_renewed.csv")
merged = d3.csv("data/mergedAverages.csv")
topology = d3.json("data/countries.json")

fire = "Fire"
air_quality = "Air Quality"
temperature = "Temperature"
emissions = "Emissions"

fireColor = "#f05d5d"
airQColor = "#d3a2e8"
tempColor = "#ffd86b"
emiColor = "#8acf99"
dark_grey = "#696969"

var colorScheme = d3.interpolateBuPu;
var colorScale;

var country_names = ["Austria",
  "Belgium",
  "Bulgaria",
  "Croatia",
  "Cyprus",
  "Czechia",
  "Denmark",
  "Estonia",
  "Finland",
  "France",
  "Germany",
  "Greece",
  "Hungary",
  "Iceland",
  "Ireland",
  "Italy",
  "Lithuania",
  "Luxembourg",
  "Malta",
  "Netherlands",
  "Norway",
  "Poland",
  "Portugal",
  "Romania",
  "Slovakia",
  "Slovenia",
  "Spain",
  "Sweden",
  "Turkey",
  ]
var selectedCountries = country_names;
      
var min_scroll,max_scroll


air_quality_text = "CO quantity (mg/m\u00B3)"
emissions_text = "Emissions (%)"
temperature_text = "Annual Average Temperature (\u00B0C)"
fires_text = "Area burned (ha)"

main_data = air_quality
isUpdate = false

var svg_line_chart = 0
var svg_parallel_coordinates = 0
var x_line,y_line,xAxis,yAxis,sumstat, all_lines;
var selectedButtonColor ="#ba8fff";

const margin = {top: 10, right: 50, bottom: 30, left: 50},
width = window.innerWidth- margin.left - margin.right;
height = window.innerHeight/2 - margin.bottom;
createCheckList(merged);

if (main_data=="Air Quality" && isUpdate == false ){
  lineColor = airQColor;
  line_chart(air_quality_data);
  
  Promise.all([topology, air_quality_data]).then(function ([map, data]){
    colorScale = d3.scaleLinear()
              .domain([d3.min(data, (d) => d.Value), d3.max(data, (d) => d.Value)])
              .range([0, 1]);
    topology = map;
    dataset = data;
    gen_geo_map();
});
}


else if (main_data=="Fire" && isUpdate == false){
  lineColor = fireColor;
  line_chart(fire_data);
  Promise.all([topology, fire_data]).then(function ([map, data]){
    topology = map;
    dataset = data;
    colorScale = d3.scaleLinear()
              .domain([d3.min(data, (d) => d.Value), d3.max(data, (d) => d.Value)])
              .range([0, 1]);
    gen_geo_map();
});
}
else if (main_data=="Temperature" && isUpdate == false){
  lineColor = tempColor;
  line_chart(temperature_data);
  Promise.all([topology, temperature_data]).then(function ([map, data]){
    topology = map;
    dataset = data;
    colorScale = d3.scaleLinear()
              .domain([d3.min(data, (d) => d.Value), d3.max(data, (d) => d.Value)])
              .range([0, 1]);
    gen_geo_map();
});
}
else if (main_data=="Emissions" && isUpdate == false){
  lineColor = emiColor;
  line_chart(emissions_data);
  Promise.all([topology, emissions_data]).then(function ([map, data]){
    topology = map;
    dataset = data;
    colorScale = d3.scaleLinear()
              .domain([d3.min(data, (d) => d.Value), d3.max(data, (d) => d.Value)])
              .range([0, 1]);
    gen_geo_map();
});
}


d3.csv("data/mergedAverages.csv").then((data) =>{
  parallelCoordinatesBrush(data);
})
.catch((error) =>{
    console.log(error);
});
draw = false;

function updateYear(y){
  isUpdate = true;
  if (main_data=="Air Quality"){
    Promise.all([topology, air_quality_data]).then(function ([map, data]){
      year = y;
      topology = map;
      dataset = data;
      isUpdate = true;
      colorScale = d3.scaleLinear()
              .domain([d3.min(data, (d) => d.Value), d3.max(data, (d) => d.Value)])
              .range([0, 1]);
      gen_geo_map();
    });
  isUpdate = false
  } 
  else if (main_data=="Fire"){
     Promise.all([topology, fire_data]).then(function ([map, data]){
      year = y;
      topology = map;
      dataset = data;
      isUpdate = true;
      colorScale = d3.scaleLinear()
              .domain([d3.min(data, (d) => d.Value), d3.max(data, (d) => d.Value)])
              .range([0, 1]);
      gen_geo_map();
    });
  isUpdate = false
  }

  else if (main_data=="Emissions"){
    Promise.all([topology, emissions_data]).then(function ([map, data]){
      year = y;
      topology = map;
      dataset = data;
      isUpdate = true;
      colorScale = d3.scaleDiverging()
              .domain([250, 100, 50]);
      gen_geo_map();
    });
  isUpdate = false
  }

  else if (main_data=="Temperature"){
    Promise.all([topology, temperature_data]).then(function ([map, data]){
      year = y;
      topology = map;
      dataset = data;
      isUpdate = true;
      colorScale = d3.scaleLinear()
              .domain([d3.min(data, (d) => d.Value), d3.max(data, (d) => d.Value)])
              .range([0, 1]);
      gen_geo_map();
    });
  isUpdate = false
  }
}

function updateTextInput(val) {
  document.getElementById('yearText').value=val; 
}

function changeButtonColor(){
  if(main_data == "Air Quality"){
    d3.selectAll(".buttons").style("background-color", "#ece5d6")
    d3.select("#airButton").style("background-color", "#a2aef0")
  }
  else if (main_data == "Fire"){
    d3.selectAll(".buttons").style("background-color", "#ece5d6")
    d3.select("#fireButton").style("background-color", "#a2aef0")
  }
  else if (main_data == "Emissions"){
    d3.selectAll(".buttons").style("background-color", "#ece5d6")
    d3.select("#emiButton").style("background-color", "#a2aef0")
  }
  else if (main_data == "Temperature"){
    d3.selectAll(".buttons").style("background-color", "#ece5d6")
    d3.select("#tempButton").style("background-color", "#a2aef0")
  }
}


function change_y_text(){
  if (main_data == air_quality){
    y_text = air_quality_text
  }

  else if (main_data == fire){
    y_text = fires_text
  }

  else if (main_data == temperature){
    y_text = temperature_text
  }

  else if (main_data == emissions){
    y_text = emissions_text
  }
  return y_text
}

function gen_geo_map(){
  if (isUpdate){
    var year_data = dataset.filter(c => c.Year === document.getElementById('sliderTime').value) ;
        
    let mouseOver = function(event,d) {
      d3.selectAll(".country")
      .style("opacity", .2)

      var year_data = dataset.filter(c => c.Year === document.getElementById('sliderTime').value) ;

      var country = year_data.find(c => c.Country == d.properties.name);

      text = change_y_text()
      
      if (country!=null ){
        d3.select(".tooltip").style("opacity", 1);
        d3.select(".tooltip").
          html(
            "Country: " +
            country.Country +
              "<br>" +
              text + ": " +
              parseFloat(country.Value).toFixed(2)
          )          
          .style("left", event.pageX+30 + "px")
          .style("top", event.pageY-50 + "px");        
      }


      if (!d3.select(this).classed("selected")){
        d3.select(this).style("opacity", 1).style("stroke", "black")
    
      }
      
    }
  
    let mouseLeave = function(event,d) {
      d3.selectAll(".country")        .attr("id", function(d, i){
        return d.properties.name;
    })
        .style("opacity", 1)
      d3.select(this)
        .style("stroke", "black")
      d3.select(".tooltip").style("opacity", 0)
      .style("left", 0 + "px")
      .style("top", 0 + "px");
    }
  
    var projection = d3
        .geoMercator()
        .scale((height))
        .rotate([0,0])
        .center([20, 32])
        .translate([width/5, height]);
  
    var path = d3.geoPath().projection(projection);
        d3.select("#map")
        .attr("width", width/2)
        .attr("height", height)
        .selectAll("path")
        .data(topojson.feature(topology, topology.objects.europe).features)
        .join("path")
        .attr("class", "country")
        .attr("d", path)
        .attr("id", function(d, i){
            return d.properties.name;
        })
        .style("stroke", "black")
        .attr("fill", function (d){
            var country = year_data.find(c => c.Country == d.properties.name);  
            if(country){
                var colorVal = colorScale(country.Value);
                return colorScheme(colorVal);
            }    
            else{
                return "gray";
        }})
        .on("mouseover", mouseOver )
        .on("mouseleave", mouseLeave )
        .append("title")
        .text( function (d){
            return d.properties.name;
        })


  }

  else {
    text = change_y_text()
    var tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position","absolute")
    .style("opacity", 0);

    let mouseOver = function(event,d) {
      d3.selectAll(".country")
      .style("opacity", .2)

      var year_data = dataset.filter(c => c.Year === document.getElementById('sliderTime').value) ;

      var country = year_data.find(c => c.Country == d.properties.name);
      
      if (country!=null ){
        d3.select(".tooltip").style("opacity", 1);
        d3.select(".tooltip").
          html(
            "Country: " +
            country.Country +
              "<br>" +
              text + ": " +
              parseFloat(country.Value).toFixed(2)
          )          
          .style("left", event.pageX+30 + "px")
          .style("top", event.pageY-50 + "px");        
      }

      if (!d3.select(this).classed("selected")){
        d3.select(this).style("opacity", 1).style("stroke", "black")
    
      }
      
    }
  
    let mouseLeave = function(event,d) {
      d3.selectAll(".country")        .attr("id", function(d, i){
        return d.properties.name;
    })
        .style("opacity", 1)
      d3.select(this)
        .style("stroke", "black")
      d3.select(".tooltip").style("opacity", 0)
      .style("left", 0 + "px")
      .style("top", 0 + "px");
    }

    var year_data = dataset.filter(c => c.Year === document.getElementById('sliderTime').value) ;
    var projection = d3
        .geoMercator()
        .scale((height))
        .rotate([0,0])
        .center([20, 32])
        .translate([width/5, height]);
  
    var path = d3.geoPath().projection(projection);
  
  
    d3.select("#map")
        .append("svg")
        .attr("width", width/2)
        .attr("height", height)
        .attr("margin-right", margin.right)
        .selectAll("path")
        .data(topojson.feature(topology, topology.objects.europe).features)
        .join("path")
        .attr("class", "country")
        .attr("id", function(d, i){
          return d.properties.name;
        })
        .attr("d", path)
        .style("stroke", "black")
        .attr("fill", function (d){
          var country = year_data.find(c => c.Country == d.properties.name);  
            if(country){
                var colorVal = colorScale(country.Value);
                return colorScheme(colorVal);
            }    
            else{
                return "gray";
        }})
        .on("mouseover", mouseOver )
        .on("mouseleave", mouseLeave )
        .append("title")
        .text( function (d){
            return d.properties.name;
        })
  }
}

function parallelCoordinatesBrush(data){
  var keys;
  var margin = ({top: 50, right: 10, bottom: 30, left: 10});
  var brushHeight = 25;

  keys = data.columns.slice(1);
  var x = {}
  for (i in keys) {
    n = keys[i]
    if(n =='Fires'){
      x[n] = d3.scaleLinear()
      .domain( d3.extent(data, function(d) { return +d[n]; }) )
      .range([margin.left, 0.45*width]);
    }
    else{
      x[n] = d3.scaleLinear()
      .domain( d3.extent(data, function(d) { return +d[n]; }) )
      .range([margin.left, 0.45*width]);
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
                .style("width", 0.5*width)
                .style("height", height + margin.bottom)
                .style("padding-left", 35);

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
  changeButtonColor()

  if (main_data=="Air Quality"){
    line_chart(air_quality_data);
    lineColor = airQColor;
    colorScheme = d3.interpolateBuPu;
    Promise.all([topology, air_quality_data]).then(function ([map, data]){
      min_scroll = d3.min(data, (d) => d.Year)
      max_scroll = d3.max(data, (d) => d.Year)
      year = parseInt((parseInt(max_scroll)+parseInt(min_scroll))/2)
      document.getElementById('sliderTime').min = min_scroll;
      document.getElementById('sliderTime').max = max_scroll;
      document.getElementById('sliderTime').value = parseInt((parseInt(max_scroll)+parseInt(min_scroll))/2)
      document.getElementById('sliderTime').value = parseInt((parseInt(max_scroll)+parseInt(min_scroll))/2);
      updateTextInput(year);
      topology = map;
      dataset = data;
      isUpdate = true;
      colorScale = d3.scaleLinear()
              .domain([d3.min(data, (d) => d.Value), d3.max(data, (d) => d.Value)])
              .range([0, 1]);
      gen_geo_map();
  });
  isUpdate = false
  } 
  else if (main_data=="Fire"){
     line_chart(fire_data);
     lineColor = fireColor;
     colorScheme = d3.interpolateReds;
     Promise.all([topology, fire_data]).then(function ([map, data]){
      min_scroll = d3.min(data, (d) => d.Year)
      max_scroll = d3.max(data, (d) => d.Year)
      year = parseInt((parseInt(max_scroll)+parseInt(min_scroll))/2)
      document.getElementById('sliderTime').min = min_scroll;
      document.getElementById('sliderTime').max = max_scroll;
      document.getElementById('sliderTime').value = parseInt((parseInt(max_scroll)+parseInt(min_scroll))/2)
      document.getElementById('sliderTime').value = parseInt((parseInt(max_scroll)+parseInt(min_scroll))/2);
      updateTextInput(year);
      topology = map;
      dataset = data;
      isUpdate = true;
      colorScale = d3.scaleLinear()
              .domain([d3.min(data, (d) => d.Value), d3.max(data, (d) => d.Value)])
              .range([0, 1]);
      gen_geo_map();
  });
  isUpdate = false
  }

  else if (main_data=="Emissions"){
    line_chart(emissions_data);
    lineColor = emiColor;
    colorScheme = d3.interpolatePiYG;
    Promise.all([topology, emissions_data]).then(function ([map, data]){
      min_scroll = d3.min(data, (d) => d.Year)
      max_scroll = 2018

      year = parseInt((parseInt(max_scroll)+parseInt(min_scroll))/2)
      document.getElementById('sliderTime').min = min_scroll;
      document.getElementById('sliderTime').max = max_scroll;
      document.getElementById('sliderTime').value = parseInt((parseInt(max_scroll)+parseInt(min_scroll))/2)
      document.getElementById('sliderTime').value = parseInt((parseInt(max_scroll)+parseInt(min_scroll))/2);
      updateTextInput(year);

      topology = map;
      dataset = data;
      isUpdate = true;
      colorScale = d3.scaleDiverging()
              .domain([250, 100, 50]);
      gen_geo_map();
  });
  isUpdate = false
  }

  else if (main_data=="Temperature"){
    line_chart(temperature_data);
    lineColor = tempColor;
    colorScheme = d3.interpolateOranges;
    Promise.all([topology, temperature_data]).then(function ([map, data]){
      min_scroll = d3.min(data, (d) => d.Year)
      max_scroll = d3.max(data, (d) => d.Year)
      year = parseInt((parseInt(max_scroll)+parseInt(min_scroll))/2)
      document.getElementById('sliderTime').min = min_scroll;
      document.getElementById('sliderTime').max = max_scroll;
      document.getElementById('sliderTime').value = parseInt((parseInt(max_scroll)+parseInt(min_scroll))/2)
      document.getElementById('sliderTime').value = parseInt((parseInt(max_scroll)+parseInt(min_scroll))/2);
      updateTextInput(year);
      topology = map;
      dataset = data;
      isUpdate = true;
      colorScale = d3.scaleLinear()
              .domain([d3.min(data, (d) => d.Value), d3.max(data, (d) => d.Value)])
              .range([0, 1]);
      gen_geo_map();
  });
  isUpdate = false
  }
}

function selects(){  
  var ele=document.getElementsByName('chk');  
  for(var i=0; i<ele.length; i++){  
      if(ele[i].type=='checkbox')  
          ele[i].checked=true;  
  }
  selectedCountries = country_names;
  update(main_data);
} 

function deSelect(){  
  var ele=document.getElementsByName('chk');  
  for(var i=0; i<ele.length; i++){  
      if(ele[i].type=='checkbox')  
          ele[i].checked=false;      
  }
  selectedCountries = [];
  update(main_data);
}  

function line_chart(dataset) {
  var color


  function mouseOver(event,d){
    color = d3.select(this).style("stroke");
    var name = d3.select(this).attr("id");

    console.log(color)
    if (selectedCountries.includes(name) ){
      svg_line_chart
        .selectAll(".line")    
        .style("opacity",.3)
      // highlight this line, fade other lines
    
      d3.select(".tooltip").style("opacity", 1);
      d3.select(".tooltip").
        html(
          name
        )          
        .style("left", event.pageX+10 + "px")
        .style("top", event.pageY-20 + "px");        
    
    if (!d3.select(this).classed("selected")){
      d3.select(this).style("opacity", 1).style("stroke", "black").style("stroke-width",3) 
    }
    }
  }
  function mouseLeave(event,d){
    var name = d3.select(this).attr("id");

    if (selectedCountries.includes(name) ){

    svg_line_chart
      .selectAll(".line")
      .attr("stroke",function(d){
        if (!selectedCountries.includes(d[0])){
          return "#ffffff"
        }
        else{
          return color
        }
      }) 
      .attr("style",function(d){
        if (!selectedCountries.includes(d[0])){
          return "#ffffff"
        }
        else{
          return color
        }
      }) 
      .style("opacity",1)
      .style("stroke-width",1.5)
    }
    d3.select(".tooltip").style("opacity", 0)
    .style("left", 0 + "px")
    .style("top", 0 + "px");
      

    // highlight this line, fade other lines
  }


  if (isUpdate){
    y_text = change_y_text()

    dataset.then( function(dataset) {
      const data = dataset;
      sumstat = d3.group(data, d => d.Country);

      svg_line_chart = d3.select("div#line_chart");
      
      x_line.domain([d3.min(data, function(d) { return d.Year }), d3.max(data, function(d) { return d.Year }) ]);
      svg_line_chart.selectAll(".myXaxis")
      .call(d3.axisBottom(x_line).ticks(20))
      .call(g => g.selectAll('.tick')
        .attr("color", "white")
      );

      y_line.domain([d3.min(data, function(d) { return +d.Value; }), d3.max(data, function(d) { return +d.Value  }) ]);
      svg_line_chart.selectAll(".myYaxis")
        .call(d3.axisLeft(y_line))
        .call(g => g.selectAll('.tick')
        .attr("color", "white")
      );

      d3.select(".ylabel").text(y_text).transition()
      
      svg_line_chart
      .selectAll(".line")
      .data(sumstat)
      .join(
        (enter) => {
          return enter
          .append("path")
          .attr("class","line")
          .attr("fill", "none")
          .attr("d", function(d){
            return d3.line()
              .x(function(d) { return x_line(d["Year"]);  })
              .y(function(d) { return y_line(+d["Value"]); })
              (d[1])
              
          })
        },
        (update) => {
          update
            .transition()
            .duration(400)
            .attr("d", function(d){
              return d3.line()
                .x(function(d) { return x_line(d["Year"]); })
                .y(function(d) { return y_line(+d["Value"]); })
                .curve(d3.curveMonotoneX)
                (d[1])
            })
            .attr("stroke", function(d){
              if (selectedCountries.includes(d[0])){
                return lineColor;
              }
              else{
                return "#ffffff";
              }
            })
            .attr("stroke-opacity", function(d) {
              if (selectedCountries.includes(d[0])){
                return 1;
              }
              else{
                return 0.1;
              }
            }).attr("id", function(d){ return d[0];});
        },
        (exit) => {
          return exit.remove();
        });
        if (main_data == "Emissions"){
          d3.select("#line_chart")
            .select("#today_line")
            .style("visibility", "visible");
        }
        else{
          d3.select("#line_chart")
            .select("#today_line")
            .style("visibility", "hidden");
        }
    })
  }

  else{
    //Read the data
  dataset.then( function(dataset) {
    const data = dataset;
    y_text = change_y_text()

    const sumstat = d3.group(data, d => d.Country);

    svg_line_chart = d3.select("div#line_chart")
    .append("svg")
      .attr("width", width )
      .attr("height", height )
    .append("g")
      .attr("transform", `translate(${margin.left+25},${margin.top})`);
  
    x_line = d3.scaleLinear()
      //.domain([new Date(1990, 0, 1),new Date(2020, 0, 1)])
      .domain(d3.extent(data, function(d) { return d.Year;}))
      .range([ 0, 0.83*width ]);

    svg_line_chart.append("g")
      .attr("transform", `translate(0, ${height+margin.bottom*(-2.9)})`)
      .attr("class","myXaxis")
      .call(d3.axisBottom(x_line).ticks(20))
      .call(g => g.select('.domain')
        .attr("stroke","white")
        .attr("stroke-width","1.5"))
      .call(g => g.selectAll('.tick')
        .attr("color", "white")
      );

    svg_line_chart.append("text")
      .attr("transform",
      "translate(" + (0.4*width) + " ," + 
                    (height-50 + margin.top) + ")")
      .style('fill', 'white')
      .style("text-anchor", "middle")
      .text("Year")

    // Add Y axis
    y_line = d3.scaleLinear()
    .domain([d3.min(data, function(d) { return +d.Value; }), d3.max(data, function(d) { return +d.Value; })])
      .range([ 0.8*height, 0 ]);

    svg_line_chart.append("g")
      .attr("class","myYaxis")
      .call(d3.axisLeft(y_line))
      .call(g => g.select('.domain')
        .attr("stroke","white")
        .attr("stroke-width","1.5"))
      .call(g => g.selectAll('.tick')
        .attr("color", "white")
      );

      svg_line_chart.append("text")
      .attr("class","ylabel")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left -23)
      .attr("x",0 - (0.8*height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style('fill', 'white')
      .text(y_text); 

    // Initialize line with group a
    svg_line_chart.selectAll(".line")
      .data(sumstat)
      .join("path")
        .attr("class","line")
        .attr("id",function(d){return d[0];})
        .attr("fill", "none")
        .attr("stroke", lineColor)
        .attr("stroke-opacity", function(d) {
          if (selectedCountries.includes(d[0])){
            return 1;
          }
          else{
            return 0.2;
          }
        })
        .attr("stroke-width", 1.5)

        .attr("d", function(d){
          return d3.line()
            .x(function(d) { return x_line(d["Year"]); })
            .y(function(d) { return y_line(+d["Value"]); })
            .curve(d3.curveMonotoneX)
            (d[1])
        })
        .on("mouseover",mouseOver)
        .on("mouseleave",mouseLeave)
        
        
      d3.select("#line_chart")
        .append("line")
        .attr("id", "today_line")
        .style("position", "absolute")
        .style("width", "1.5px")
        .style("height", height/2)
        .style("top", "540px")
        .style("bottom", "60px")
        .style("left", "788px")
        .style("background", "#fff")
        .style("visibility", "hidden");
  })
  }
}

function createCheckList(data){
  data.then(function (data){
    d3.select("div#checkList")
      .selectAll("div")
      .data(data)
      .join("div")
        //.attr("class","countryList")
        .append('label')
            .attr('for',function(d,i){ return 'a'+i; })
            .text(function(d) { return d.Country; })
        .append("input")
            .attr("checked", true)
            .attr("type", "checkbox")
            .attr("name", "chk")
            .attr("id", function(d) { return d.Country ; })
            .attr("onClick", "checkClick(this)");
  });
}

function checkClick(country){
  if(country.checked == true){
    selectedCountries.push(country.id);
  }
  else{
    selectedCountries = selectedCountries.filter(c => c != country.id);
  }
  update(main_data);
}

