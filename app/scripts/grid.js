import * as d3 from 'd3'
import getSquareSizing from './getSquareSizing'

export default function gridMaker() {

  d3.selectAll('svg').remove()

  var container = d3.select('#dot-graphic')
  var containerWidth = document.getElementById('dot-graphic').offsetWidth;

  var colorScale = { base: d3.color('rgba(204, 186, 165, 1)'), scale: [] }

  var width = containerWidth
  var height = containerWidth

  var x = d3.scaleBand()
  var y = d3.scaleBand()

  var svg = container.append('svg')
      .attr('width', width)
      .attr('height', height)

  var jsonURL = window.LINE_JSON

  d3.json(jsonURL, function(error, data) {

    //only two data points
    data = data.boxes
    var dataSet = data[0]

    //Format data
    dataSet.doses = +dataSet.doses;
    dataSet.executions = +dataSet.executions;

    var sideLength = getSquareSizing(width, height, dataSet.doses)

    var cols = Math.round(width / sideLength)
    var rows = Math.round(height / sideLength)

    var padding = 0.25

    x.domain(d3.range(cols))
      .range([0, width])
      .padding(padding)
      .paddingOuter(0)

    y.domain(d3.range(rows))
      .range([0, height])
      .padding(padding)
      .paddingOuter(0)

    var radius = x.bandwidth() / 2

    var circleGroup = svg.selectAll('g')
      .data(data)
      .enter()
      .append('g');

    circleGroup.each(function(d,i) {
        for (var k = 0; k < d.doses; k++) {
          // console.log(y(Math.floor(k / cols)))
          d3.select(this).append('circle')
            .attr('cx', x(k % cols) + radius)
            .attr('cy', y(Math.floor(k / cols)) + radius)
            .attr('class', function(d,i) { return k >= (d.doses - d.executions) ? "circle execution" : "circle" })
            .attr('r', radius)
        }
    })
  });
}
