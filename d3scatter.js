//Alters the size of the graph
var margin = {top: 30, right: 20, bottom: 30, left: 50};
    var w = 600 - margin.left - margin.right;
    var h = 270 - margin.top - margin.bottom;


d3.csv("crashes.csv", function(error, stocks) {
  console.log(stocks);
  if(error) return console.warn(error);
    stocks.forEach(function(d) {
      d.price = +d.price;
      //d.date = format.parse(d.date);
  });
    var data = stocks;
    createVisual(data);    
});

var col = d3.scale.category10();

var svg = d3.select("body").append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// set up x
var x = d3.scale.linear()
        .domain([2000, 2009])
        .range([0, w]);

//set up y
var y = d3.scale.linear()
        .domain([0, 1000])
        .range([h, 0]);


//creates own scale with set  rbg range and max vol
var gscale = d3.scale.linear().domain([0, 1200]).range([0,255]);

var xAxis = d3.svg.axis().scale(x).orient("bottom");   

svg.append("g").attr("class", "axis").attr("transform", "translate(0," + h + ")").call(xAxis).append("text").attr("x", w).attr("y", -6).style("text-anchor", "end").text("Year");

var yAxis = d3.svg.axis().scale(y).orient("left"); //orient: puts it on the left side

svg.append("g").attr("class", "axis").call(yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text("Fatalities");

var tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

function createVisual(data) {
 var circles = svg.selectAll("circle")
 .data(data)
 .enter()
 .append("circle")
    .attr("cx", function(d) { return x(d.Date);  })
    .attr("cy", function(d) { return y(d.Fatalities);  })
    .attr("r", 4)
    .style("stroke","black")
    .style("fill", function(d) { return "rgb(" + gscale(d.vol) + "," + gscale(d.vol) + "," + gscale(d.vol) + ")";}) //returns rgb value depending on the d.vol
    //.style("opacity","0.5"); 
    .on("mouseover", function(d) {
      tooltip.transition()
        .duration(200)
        .style("opacity", .9);
      tooltip.html(d.Operator + "<br />")
        .style("left", (d3.event.pageX + 5) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });
}






