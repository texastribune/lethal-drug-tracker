import * as d3 from 'd3'
import getSquareSizing from './getSquareSizing'

export default function gridMaker() {

  d3.selectAll('svg').remove()

  var svg, g, rectsGroup
  var isMobile = checkIfMobile()
  var container = d3.select('#dot-graphic')
  var containerWidth = document.getElementById('dot-graphic').offsetWidth;


  var colorScale = { base: d3.color('rgba(204, 186, 165, 1)'), scale: [] }

  // var margin = {
  //   top: isMobile ? 35 : 60,
  //   right: isMobile ? 30 : 40,
  //   bottom: isMobile ? 30 : 60,
  //   left: isMobile ? 30 : 40
  // }

  var width = containerWidth
  var height = containerWidth

  var x = d3.scaleBand()
  var y = d3.scaleBand()

  svg = container.append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('shape-rendering', 'crispEdges')

  g = svg.append('g')
    .attr('transform', 'translate(0,0)')

  rectsGroup = g.append('g')

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

    var xWidth = x.bandwidth()
    var yWidth = y.bandwidth()

    var cells = rectsGroup.selectAll('rect')
      .data(data)
      .enter().append('rect')
      .attr('class', 'cell')
      .attr('x', (d, i) => x(i % cols))
      .attr('y', (d, i) => y(Math.floor(i / cols)))
      .attr('fill', 'blue')
      .attr('width', xWidth)
      .attr('height', yWidth)
  });
}

function checkIfMobile () {
  return window.innerWidth < 899
}
