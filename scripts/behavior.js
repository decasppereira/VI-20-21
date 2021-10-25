var click = false

fire_data = d3.csv("data/fires_hectars.csv")
air_quality_data = d3.csv("data/air_quality_CO.csv")
temperature_data = d3.csv("data/annual_avg_temp.csv")
emissions_data = d3.csv("data/emissions_totals.csv")

main_data = fire_data


function update(data) {
  click = true
  main_data = data
  // Create the X axis:
  x.domain([0, d3.max(main_data, function(d) { return d.Year }) ]);
  svg.selectAll(".myXaxis").transition()
    .duration(3000)
    .call(xAxis);

  // create the Y axis
  y.domain([0, d3.max(main_data, function(d) { return d.Value  }) ]);
  svg.selectAll(".myYaxis")
    .transition()
    .duration(3000)
    .call(yAxis);

  // Create a update selection: bind to the new data
  const u = svg.selectAll(".lineTest")
    .data([main_data], function(d){ return d.Country });

  // Updata the line
  u
    .join("path")
    .attr("class","lineTest")
    .transition()
    .duration(3000)
    .attr("d", d3.line()
      .x(function(d) { return x(d.Year); })
      .y(function(d) { return y(d.Value); }))
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2.5)
}

function init(){
  return lineChart();
}


function lineChart() {
data = fire_data

if (click == true){
  data = main_data
  click = false
}

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