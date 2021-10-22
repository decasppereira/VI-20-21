
function init(){
    return lineChart();
}


function lineChart() {
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
d3.csv("data/fires_hectars.csv").then( function(data) {
    //var max = d3.max(data, d=>d["1991"]) ;
    var years = []

    for (i=0;i<data.length;i++){
      if (!(years.includes(data[i]["Year"]))){
        years.push(data[i]["Year"]);
      }
    }

    const sumstat = d3.group(data, d => d.Country);
    
    
  
    //var max = d3.max(data, function(d) { return +d[year]; });  
    //console.log(max);  
    //var size = Math.log(max) * Math.LOG10E + 1 | 0;

    //max= Math.ceil(max/Math.pow(10,size-2))*Math.pow(10,(size-2));
    //console.log(max);


    // List of groups (here I have one group per column)
    //const allGroup = ["Air Quality","Emissions","Fires","Temperatures"]

    const allGroup = ["Fires","valueB"]
    // add the options to the button
    d3.select("#selectButton")
      .selectAll('myOptions')
     	.data(allGroup)
      .enter()
    	.append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button

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
    .domain([0, d3.max(data, function(d) { return +d.Hectars_Burned; })])
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
            .y(function(d) { return y(+d["Hectars_Burned"]); })
            (d[1])
        })
    // A function that update the chart
    function update(selectedGroup) {

      // Create new data with the selection?
      const dataFilter = data.map(function(d){return {time: d.time, value:d[selectedGroup]} })

      // Give these new data to update line
      line
          .datum(dataFilter)
          .transition()
          .duration(1000)
          .attr("d", d3.line()
            .x(function(d) { return x(+d[year]) })
            .y(function(d) { return y(+d[country]) })
          )
          .attr("stroke", function(d){ return myColor(selectedGroup) })
    }

    // When the button is changed, run the updateChart function
    d3.select("#selectButton").on("change", function(event,d) {
        // recover the option that has been chosen
        const selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        update(selectedOption)
    })

})

    
}