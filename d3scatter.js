var dataset; // global variable for data from CSV file
var secondaryData;
var tertiaryData;
var master;

d3.csv("crashes.csv", function(error, data) {
    if(error) return console.warn(error);
        data.forEach(function(d) {
          d.price = +d.price;
        }
    );
    dataset = data;    
    master = dataset;
    createVisual(data);
});

function reset() {
  d3.csv("crashes.csv", function(error, data) {
    if(error) return console.warn(error);
        data.forEach(function(d) {
          d.price = +d.price;
        }
    );
    dataset = data;    
    master = dataset;
    createVisual(data);
  });
  resetStates();
}

function resetStates() {
    $("#airplane-type").prop('disabled', false);
    $("#month").prop('disabled', true);
    $("#slider-range").slider({
        disabled: false,
    }); 

    $('#airplane-type').get(0).selectedIndex = 0;
    $('#month').get(0).selectedIndex = 0;

    $("#amount").val( 75 + " - " + 200 );

    $("#slider-range").slider({
        disabled: true,
        range: true,
        min: 0,
        max: 275,
        values: [ 75, 200 ]
    });



    dataset = null; // global variable for data from CSV file
    secondaryData = null;
    tertiaryData = null;
    master = null;

}

function updateFilter(option) {    
    var filter = option.value;   
    $("#month").prop('disabled', false);
 
    if (filter.toLowerCase() == "private") {      
      var filteredData = dataset.filter(function(i) { return (i.Operator.indexOf("Military") != -1 || i.Operator.indexOf("Private") != -1) });      
      createVisual(filteredData);
      secondaryData = filteredData; //daniel's changes
    } else if (filter.toLowerCase() == "commercial") {      
      var filteredData = dataset.filter(function(i) { return (i.Operator.indexOf("Military") == -1 && i.Operator.indexOf("Private") == -1) });      
      createVisual(filteredData);
      secondaryData = filteredData; //daniel's changes
    } else {      
      createVisual(dataset);
      secondaryData = dataset; //daniel's changes

    }
}

function updateMonth(option) {
    $("#slider-range").slider({
        disabled: false,
    }); 

    $("#airplane-type").prop('disabled', true);

    var month = option.value; 
    if(month == "none") {      
      createVisual(secondaryData);
      tertiaryData = secondaryData; //daniel's changes
    } else {       
      var newData = secondaryData.filter(function(d) { return (d.Month == month) });
      createVisual(newData);
      tertiaryData = newData; //daniel's changes
    }
}

function updateRange(first, second) {
    $("#month").prop('disabled', true);
    var newData = tertiaryData.filter(function(d) { return d.Fatalities >= first && d.Fatalities <= second });
    createVisual(newData);
}

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
        .style("fill", "#ffffff")
        .style("cursor", "pointer");
    })
    .on("mouseout", function(d) {
        tooltip.transition()
             .duration(300)
             .style("opacity", 0);
        d3.select(this).transition()
          .duration(300)
          .style("fill", "#000000")        
          .style("cursor", "default");
    }); 

  $(function() {
      $("#slider-range").slider({
        disabled: true,
        range: true,
        min: 0,
        max: 275,
        values: [ 75, 200 ],
        slide: function( event, ui ) {
            $("#amount").val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
            updateRange(ui.values[ 0 ], ui.values[ 1 ]);
        }
      });
    $("#amount").val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
  });
}

var margin = {top: 30, right: 20, bottom: 30, left: 50};
    var w = 640 - margin.left - margin.right;
    var h = 480 - margin.top - margin.bottom;

var color = d3.scale.category20();

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

var xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.format("d")).ticks(10);   

var yAxis = d3.svg.axis().scale(y).orient("left");

//creates own scale with set  rbg range and max vol
var gscale = d3.scale.linear().domain([0, 1200]).range([0,255]);

svg.append("g").attr("class", "axis").attr("transform", "translate(0," + h + ")").call(xAxis).append("text").attr("x", w / 2).attr("y", 30).style("text-anchor", "end").text("Year");

svg.append("g").attr("class", "axis").call(yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text("Fatalities");

var infobox = d3.select("body").append("div")
    .attr("class", "infobox");

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);