import * as d3 from 'd3';

//d3 step chart
export default function buildChart() {

  d3.selectAll('svg').remove();

  var windowWidth;
  if(window.innerWidth > 640) {
    windowWidth =  640;
  } else {
    windowWidth = window.innerWidth;
  }

  var margin = {top: 45, right: 30, bottom: 30, left: 20},
      width = windowWidth - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

  // parse the date / time
  var parseTime = d3.timeParse("%Y-%m-%d");

  var x = d3.scaleLinear().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  var bisectDate = d3.bisector(function(d) { return d.date; }).left;

  var xAxis = d3.axisBottom()
    .scale(x)
    .ticks(5)
    .tickFormat(d3.timeFormat("%b %Y"));

  var yAxis = d3.axisLeft()
    .scale(y)
    .ticks(5)
    .tickSize(0)
    .tickFormat(function(d) {
      // return d;
      return d === y.domain()[1] ? d + ' doses' : d;
    });

  var valueline = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(+d.total); })
    .curve(d3.curveStepAfter);

  var svg = d3.select('#step-chart')
    .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform',
            'translate(' + margin.left + ',' + margin.top + ')');

  // Get the data
  var jsonURL = window.LINE_JSON

  d3.json(jsonURL, function(error, data) {

    data = data.chart;

    //Format data
    data.forEach(function(d) {
      d.date = parseTime(d.date);
      d.total = +d.total;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return +d.total; })]);

    // Add the valueline path.
    svg.append('path')
      .attr('class', 'line')
      .attr('d', valueline(data));

    // Add the X Axis
    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);

    // Add the Y Axis
    svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
        .selectAll('text')
          .attr('text-anchor', 'start')
          .attr('x', -13)
          .attr('dy', -0.5);
  });
}
