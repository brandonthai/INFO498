var dataset; // global variable for data from CSV file

function updateFilter(option) {
  d3.csv("crashes.csv", function(error, data) {
    if(error) return console.warn(error);
    data.forEach(function(d) {
      d.price = +d.price;
    });
    dataset = data;
    var filter = option.value;    
    if (filter.toLowerCase() == "private") {
      var filteredData = data.filter(function(i) { return (i.Operator.indexOf("Military") != -1 || i.Operator.indexOf("Private") != -1) });
      createVisual(filteredData);
    } else if (filter.toLowerCase() == "commercial") {
      var filteredData = data.filter(function(i) { return (i.Operator.indexOf("Military") == -1 && i.Operator.indexOf("Private") == -1) });
      createVisual(filteredData);
    } else {
      createVisual(data);
    }
})};

function updateMonth(option) {
    var month = option.value; 
    if(month == "none") {
      createVisual(dataset);
    } else { 
      var newData = dataset.filter(function(d) { return (d.Month == month) });
      createVisual(newData);
    }
}

//Alters the size of the graph
var margin = {top: 30, right: 20, bottom: 30, left: 50};
    var w = 640 - margin.left - margin.right;
    var h = 480 - margin.top - margin.bottom;

var yMax = 0;

var color = d3.scale.category20();

d3.csv("crashes.csv", function(error, data) {
    console.log(data);
    if(error) return console.warn(error);
        data.forEach(function(d) {
          d.price = +d.price;
        }
    );
    createVisual(data);
});

var col = d3.scale.category10();

var svg = d3.select("div").append("svg")
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
    .domain([0, 275])
    .range([h, 0]);

//creates own scale with set  rbg range and max vol
var gscale = d3.scale.linear().domain([0, 1200]).range([0,255]);

var xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.format("d")).ticks(10);   

svg.append("g").attr("class", "axis").attr("transform", "translate(0," + h + ")").call(xAxis).append("text").attr("x", w).attr("y", -6).style("text-anchor", "end").text("Year");

var yAxis = d3.svg.axis().scale(y).orient("left"); //orient: puts it on the left side

svg.append("g").attr("class", "axis").call(yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text("Fatalities");

var infobox = d3.select("body").append("div")
    .attr("class", "infobox");

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

function createVisual(data) {
    d3.selectAll("circle").remove(); 
    var circles = svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("fill",function(d,i){return color(i);})
    .attr("cx", function(d) { return x(d.Year);  })
    .attr("cy", function(d) { return y(d.Fatalities);  })
    .attr("r", 4)
    .style("stroke","black")
    .style("fill", function(d) { return "rgb(" + gscale(d.vol) + "," + gscale(d.vol) + "," + gscale(d.vol) + ")";}) //returns rgb value depending on the d.vol
    .on("click", function(d) {  
        infobox.html("<h2>" + d.Operator + "&nbsp; <small>" + "(" + d.Date + ")" + "</small>" + "</h2>" + "<br />"  + d.Summary + "<br /><br /><b> Passengers Aboard: </b>" + d.Aboard + "<br /><b>Fatalities: </b>" + d.Fatalities)
        .attr("class", "infobox-show");
    })
    .on("mouseover", function(d) {
        tooltip.transition()
        .duration(100)
        .style("opacity", .9);
    tooltip.html(d.Operator + "<br />")
        .style("left", (d3.event.pageX + 5) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
    d3.select(this).transition()
        .duration(100)
        .style("fill", "#ffffff");
    d3.select(this).style("cursor", "pointer");
    })
    .on("mouseout", function(d) {
        tooltip.transition()
             .duration(300)
             .style("opacity", 0);
        d3.select(this).transition()
          .duration(300)
          .style("fill", "#000000");
        d3.select(this)
          .style("cursor", "default");
    }); 

$(function() {
    $( "#slider-range" ).slider({
        range: true,
        min: 0,
        max: 275,
        values: [ 75, 200 ],
        slide: function( event, ui ) {
            $( "#amount" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
            updateRange(ui.values[ 0 ], ui.values[ 1 ]);
        }
    });
    $( "#amount" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
  });
}

function updateRange(first, second) {
    var newData = dataset.filter(function(d) { return d.Fatalities >= first && d.Fatalities <= second });
    createVisual(newData);
  }