
var stack = d3.layout.stack();
var parse = d3.time.format("%H").parse;
var margin = {top: 20, right: 160, bottom: 35, left: 30};



function buildMap(timescale){
  d3.selectAll("svg").remove();
  reformatted={}
  stacks = []
  formatted_stacks=[]
  steady_keys=[]
  colors=[]
  var width = 960 - margin.left - margin.right,
    height = 750 - margin.top - margin.bottom;

  var svg = d3.select("body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.csv(document.getElementsByTagName("p")[0].innerHTML, function(error, data) {
    for (var d in data){
        if (timescale == "hours"){
          hour = new Date(data[d].timestamp).getHours()

        }else{
          hour = new Date(data[d].timestamp).getMinutes()
        }
        if(!reformatted.hasOwnProperty(hour)){
          reformatted[hour]={}
          reformatted[hour][data[d].host]=1
        }else{
          if (!reformatted[hour].hasOwnProperty(data[d].host)){
            reformatted[hour][data[d].host]=1
          }else{
             reformatted[hour][data[d].host]= reformatted[hour][data[d].host] + 1
          }
        }
    }
    for (hour in reformatted){
      f = {}
      f["hour"]=hour
      for (host in reformatted[hour]){

        f[host]= reformatted[hour][host]

      }
      stacks.push(f)
    }
    for (stack in stacks){
      for (key in Object.keys(stacks[stack])){
        obj = Object.keys(stacks[stack])
        if (obj[key]!='hour'){
          if (!steady_keys.includes(obj[key])){
            steady_keys.push(obj[key])
          }
        }

      }
    }

    formatted_stacks = d3.layout.stack()(steady_keys.map(function(key) {
      return stacks.map(function(stack) {
        if (stack[key]){
          return {x: stack.hour, y: +stack[key],host:key};
        }else{
          return {x: stack.hour, y: +0,host:key};
        }
      
      });
    }));
    for (key in steady_keys){
      colors.push(getRandomColor())
    }

      
    
    d3.layout.stack()(formatted_stacks)



  var x = d3.scale.ordinal()
    .domain(formatted_stacks[0].map(function(d) { return d.x; }))
    .rangeRoundBands([10, width-10], 0.02);

  var y = d3.scale.linear()
    .domain([0, d3.max(formatted_stacks, function(d) {  return d3.max(d, function(d) { return d.y0 + d.y; });  })])
    .range([height, 0]);



  // Define and draw axes
  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(5)
    .tickSize(-width, 0, 0)
    .tickFormat( function(d) { return d } );

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")


  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);


  // Create groups for each series, rects for each segment 


  var groups = svg.selectAll("g.cost")
    .data(formatted_stacks)
    .enter().append("g")
    .attr("class", "cost")
    .style("fill", function(d, i) { return colors[i]; });
  var rect = groups.selectAll("rect")
    .data(function(d) { return d; })
    .enter()
    .append("rect")
    .attr("x", function(d) { return x(d.x); })
    .attr("y", function(d) { return y(d.y0 + d.y); })
    .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
    .attr("width", x.rangeBand())
    .on("mouseover", function() { tooltip.style("display", null); })
    .on("mouseout", function() { tooltip.style("display", "none"); })
    .on("mousemove", function(d) {
      var xPosition = d3.mouse(this)[0] - 15;
      var yPosition = d3.mouse(this)[1] - 25;
      tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
      tooltip.select("text").text("host: "+ d.host + " packets: "+ d.y);
    });


  var legend = svg.selectAll(".legend")
    .data(colors)
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(30," + i * 19 + ")"; });
   
  legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", function(d, i) {return colors[i];});

  legend.append("text")
    .attr("x", width + 5)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "start")
    .text(function(d, i) { 
      return steady_keys[i]
    });


  // Prep the tooltip bits, initial display is hidden
  var tooltip = svg.append("g")
    .attr("class", "tooltip")
    .style("display", "none");
      
  tooltip.append("rect")
    .attr("width", 30)
    .attr("height", 20)
    .attr("fill", "white")
    .style("opacity", 0.5);

  tooltip.append("text")
    .attr("x", 15)
    .attr("dy", "1.2em")
    .style("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("font-weight", "bold");

  });
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
buildMap("hours")
