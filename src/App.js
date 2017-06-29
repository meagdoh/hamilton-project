import React, { Component } from 'react';
import * as d3 from 'd3';
import './App.css';

class App extends Component {

  componentDidMount() {
    drawBubbleChart();
  }

  render() {
    return (
      <div className="App">
        <svg width="960" height="940"></svg>
      </div>
    );
  }
}

function drawBubbleChart() {
  var svg = d3.select("svg"),
    width = +svg.attr("width");
    //d3.format explained (",d") adds comma per thousand a.k.a.
    // decimal notation https://github.com/d3/d3-format
  var format = d3.format(",d");
  //https://github.com/d3/d3-scale/blob/master/README.md#scaleOrdinal (See: Category Scales for understanding color)
  var color = d3.scaleOrdinal(d3.schemeCategory20c);

  var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("color", "white")
    .style("padding", "8px")
    .style("background-color", "rgba(0, 0, 0, 0.75)")
    .style("border-radius", "6px")
    .style("font", "12px sans-serif")
    .text("tooltip");

  var pack = d3.pack()
  //pack.size[width,height]
      .size([width, width])
      //pack.padding = space between circles
      .padding(1.5);

  d3.csv("data.csv", function(d) {
    //'d' is passed as an anonmyous function to represent data
    d.value = +d.value;
    if (d.value) return d;
  }, function(error, classes) {
    //https://github.com/d3/d3-hierarchy/blob/master/README.md#hierarchy
    if (error) throw error;

    var root = d3.hierarchy({children: classes})
        .sum(function(d) { return d.value; })
        .each(function(d) {
          if (id = d.data.id) {
            var id, i = id.lastIndexOf(".");
            d.id = id;
            d.package = id.slice(0, i);
            d.class = id.slice(i + 1);
          }
        });

    var node = svg.selectAll(".node")
        .data(pack(root).leaves())
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append("circle")
        .attr("id", function(d) { return d.id; })
        .attr("r", function(d) { return d.r; })
        .style("fill", function(d) { return color(d.package); })
        .on("mouseover", function(d) {
              tooltip.text(d.id + ": " + "$" + format(d.value));
              tooltip.style("visibility", "visible");
            })
        .on("mousemove", function() {
          return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
            })
        .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

    node.append("clipPath")
        .attr("id", function(d) { return "clip-" + d.id; })
      .append("use")
        .attr("xlink:href", function(d) { return "#" + d.id; });
    
  });


}

export default App;
