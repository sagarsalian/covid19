
// set the dimensions and margins of the graph
var margin = {top: 10, right: 20, bottom: 30, left: 50},
    width = 600 - margin.left - margin.right,
    height = 520 - margin.top - margin.bottom;
    
var xaxisDomain =  [0 , 40];
var xaxisRange = [0, width];

var yaxisDomain =  [0 , 10];
var yaxisRange = [height, 0];

var zaxisDomain = [0 , 500];
var zaxisRange = [4 , 40];

// append the svg object to the body of the page
var svg = d3.select("#d3chart1")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("./scripts/d3-KA-BubbleChart-Data.csv", function(data) {

  // Add X axis
  var x = d3.scaleLinear()
    .domain(xaxisDomain)
    .range(xaxisRange);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
    


  // Add Y axis
  var y = d3.scaleLinear()
    .domain(yaxisDomain)
    .range(yaxisRange);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Add a scale for bubble size
  var z = d3.scaleLinear()
    .domain(zaxisDomain)
    .range(zaxisRange);

  // Add a scale for bubble color
  var myColor = d3.scaleOrdinal()
    .domain(["Karnataka"])
    .range(d3.schemeSet2);

  // -1- Create a tooltip div that is hidden by default:
  var tooltip = d3.select("#d3chart1")
    .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "black")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("color", "white")

  // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
  var showTooltip = function(d) {
    tooltip
      .transition()
      .duration(200)
    tooltip
      .style("opacity", 1)
      .html("State : " + d.state + " , District : " + d.district)
      .style("left", (d3.mouse(this)[0]+30) + "px")
      .style("top", (d3.mouse(this)[1]+30) + "px")
  }
  var moveTooltip = function(d) {
    tooltip
      .style("left", (d3.mouse(this)[0]+30) + "px")
      .style("top", (d3.mouse(this)[1]+30) + "px")
  }
  var hideTooltip = function(d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)
  }

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("class", "bubbles")
      .attr("cx", function (d) { return x(d.confirmed); } ) //x(d.district)
      .attr("cy", function (d) { return y(d.recovered); } )
      .attr("r", function (d) {
          if(d.death > 0 && d.death <= 5)
             return z(20);
          else if(d.death > 5 && d.death <= 10)
             return z(25);
          else if(d.death > 10 && d.death <= 20)
             return z(25);          
          else
             return z(30); 
          } 
      )
      .style("fill", function (d) { return myColor(d.state); } )
    // -3- Trigger the functions
    .on("mouseover", showTooltip )
    .on("mousemove", moveTooltip )
    .on("mouseleave", hideTooltip )

  });

