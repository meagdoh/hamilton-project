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

  var format = d3.format(",d");

  var color = d3.scaleOrdinal(d3.schemeCategory20c);

  var pack = d3.pack()
      .size([width, width])
      .padding(1.5);

  d3.csv("data.csv", function(d) {
    d.value = +d.value;
    if (d.value) return d;
  }, function(error, classes) {
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
        .style("fill", function(d) { return color(d.package); });

    node.append("clipPath")
        .attr("id", function(d) { return "clip-" + d.id; })
      .append("use")
        .attr("xlink:href", function(d) { return "#" + d.id; });

    node.append("title")
        .text(function(d) { return d.id + "\n" + format(d.value); });
  });
}

export default App;
