fire_data = d3.csv("data/fires_hectars.csv")
air_quality_data = d3.csv("data/air_quality_CO.csv")
temperature_data = d3.csv("data/annual_avg_temp.csv")
emissions_data = d3.csv("data/emissions_totals.csv")

fire = "Fire"
air_quality = "Air Quality"

main_data = air_quality

draw = true

function init(){
  if (main_data=="Air Quality") line_chart(air_quality_data);
  else if (main_data=="Fire") line_chart(fire_data);

  if (draw){
    parallelCoordinatesChart()
    draw=false
  }
}

function updateData(data_name) {
  main_data = data_name
  init()
}

function updateData_air_quality(svg) {
  
  lineChart_air_quality()
}
function parallelCoordinatesChart() {

  // set the dimensions and margins of the graph
  const margin = {top: 30, right: 10, bottom: 10, left: 0},
  width = 500 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  const svg = d3.select("#parallelCoordinates")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          `translate(${margin.left},${margin.top})`);

  d3.csv("data/merge_air_fires.csv").then( function(data) {    
    // Extract the list of dimensions we want to keep in the plot. Here I keep all except the column called Country
    dimensions = Object.keys(data[0]).filter(function(d) { return d != "Country" & d!="Year"})
    console.log(dimensions)
  
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
    svg
      .selectAll("myPath")
      .data(data)
      .enter().append("path")
      .attr("d",  path)
      .style("fill", "none")
      .style("stroke", "#69b3a2")
      .style("opacity", 0.5)
// Draw the axis:
    svg.selectAll("myAxis")
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
