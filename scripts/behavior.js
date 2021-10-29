fire_data = d3.csv("data/fires_hectars.csv")
air_quality_data = d3.csv("data/air_quality_CO.csv")
temperature_data = d3.csv("data/annual_avg_temp_renewed.csv")
emissions_data = d3.csv("data/emissions_totals_renewed.csv")


fire = "Fire"
air_quality = "Air Quality"
temperature = "Temperature"
emissions = "Emissions"

main_data = air_quality

isUpdate = false

var svg_line_chart = 0
var svg_parallel_coordinates = 0
var x,y,xAxis,yAxis,sumstat, all_lines;


const margin = {top: 10, right: 100, bottom: 30, left: 50},
  width = 1500 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;



  if (main_data=="Air Quality" && !isUpdate){
    
    line_chart(air_quality_data);
   
  } 
  else if (main_data=="Fire") line_chart(fire_data);

  else if (main_data=="Temperature") line_chart(temperature_data);

  else if (main_data=="Emissions") line_chart(emissions_data);


  
  //parallelCoordinatesChart()



function updateData_air_quality(svg) {
  
  lineChart_air_quality()
}
function parallelCoordinatesChart() {

  // append the svg object to the body of the page
  const svg_parallel_coordinates = d3.select("#parallelCoordinates")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          `translate(${margin.left},${margin.top})`);

  d3.csv("data/merge_air_fires.csv").then( function(data) {    
    // Extract the list of dimensions we want to keep in the plot. Here I keep all except the column called Country
    dimensions = Object.keys(data[0]).filter(function(d) { return d != "Country" & d!="Year"})
  
    // For each dimension, I build a linear scale. I store all in a y object
    var y = {}
    for (i in dimensions) {
      var name = dimensions[i]
      y[name] = d3.scaleLinear()
        .domain( d3.extent(data, function(d) { return +d[name]; }) )
        .range([height, 0])
    }
    
    // Build the X scale -> it find the best position for each Y axis
    x = d3.scalePoint()
      .range([0, width])
      .padding(1)
      .domain(dimensions);

    // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
    function path(d) {
      return d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
    }

    // Draw the lines
    svg_parallel_coordinates
      .selectAll("myPath")
      .data(data)
      .enter().append("path")
      .attr("d",  path)
      .style("fill", "none")
      .style("stroke", "#69b3a2")
      .style("opacity", 0.5)
// Draw the axis:
    svg_parallel_coordinates.selectAll("myAxis")
      // For each dimension of the dataset I add a 'g' element:
      .data(dimensions).enter()
      .append("g")
      // I translate this element to its right position on the x axis
      .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
      // And I build the axis with the call function
      .each(function(d) { d3.select(this).call(d3.axisLeft().scale(y[d])); })
      // Add axis title
      .append("text")
        .style("text-anchor", "middle")
        .attr("y", -9)
        .text(function(d) { return d; })
        .style("fill", "black")
  })
}
  
function update(data) {
  main_data = data
  isUpdate = true
  
  if (main_data=="Air Quality"){
    line_chart(air_quality_data);
   
  } 
  else if (main_data=="Fire"){
     line_chart(fire_data);
  }

  else if (main_data=="Emissions"){
    line_chart(emissions_data);
  }

  else if (main_data=="Temperature"){
    line_chart(temperature_data);
  }
}




function line_chart(data) {

if (isUpdate){
  isUpdate=false

  data.then( function(data) {
    sumstat = d3.group(data, d => d.Country);
    svg_line_chart = d3.select("div#line_chart")
    
    x.domain([d3.min(data, function(d) { return d.Year }), d3.max(data, function(d) { return d.Year }) ]);
    svg_line_chart.selectAll(".myXaxis").transition()
    .duration(1000)
    .call(d3.axisBottom(x));

    y.domain([d3.min(data, function(d) { return +d.Value; }), d3.max(data, function(d) { return +d.Value  }) ]);
    svg_line_chart.selectAll(".myYaxis")
      .transition()
      .duration(1000)
      .call(d3.axisLeft(y));
    
    console.log(sumstat)
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
            .x(function(d) { return x(d["Year"]); })
            .y(function(d) { return y(+d["Value"]); })
            (d[1])
        })
      },
      (update) => {
        update
          .transition()
          .duration(750)
          .attr("d", function(d){
            return d3.line()
              .x(function(d) { return x(d["Year"]); })
              .y(function(d) { return y(+d["Value"]); })
              (d[1])
          })
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
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
 
   x = d3.scaleLinear()
    //.domain([new Date(1990, 0, 1),new Date(2020, 0, 1)])
    .domain(d3.extent(data, function(d) { return d.Year;}))
    .range([ 0, width ]);
    svg_line_chart.append("g")
    .attr("transform", `translate(0, ${height})`)
    .attr("class","myXaxis")
    .call(d3.axisBottom(x).ticks(21));

  // Add Y axis
   y = d3.scaleLinear()
  .domain([d3.min(data, function(d) { return +d.Value; }), d3.max(data, function(d) { return +d.Value; })])
    .range([ height, 0 ]);
    svg_line_chart.append("g")
    .attr("class","myYaxis")
    .call(d3.axisLeft(y));

  // Initialize line with group a
  svg_line_chart.selectAll(".line")
    .data(sumstat)
    .join("path")
      .attr("class","line")
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



}
