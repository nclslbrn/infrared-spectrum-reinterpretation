/**!
 * File: wavelength.js
 */

function chart_this( molecule_ir_data ) {

  var ir_data = Array.prototype.slice.call(molecule_ir_data);
  var container = document.getElementById('canvas-wrapper');

  ir_data.forEach(function(d) {
    d.frequency = d.frequency;
    d.value = d.value;
  });

  var margin = {top: 20, right: 30, bottom: 30, left: 40},
    width = container.offsetWidth - margin.left - margin.right,
    height = container.offsetHeight - margin.top - margin.bottom;

  var x = d3.scaleLinear().rangeRound([width, 0]);
  var y = d3.scaleLinear().rangeRound([height, 0]);

  var area = d3.area()
      .x(function(d) { return x(d.frequency); })
      .y1(function(d) { return y(d.value); });

  var svg = d3.select("body #canvas-wrapper").append("svg").attr('class', 'area-chart')
      .datum(ir_data)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // gridlines in x axis function
  function make_x_gridlines() {
      return d3.axisBottom(x)
          .ticks(5)
  }

  // gridlines in y axis function
  function make_y_gridlines() {
      return d3.axisLeft(y)
          .ticks(5)
  }
  x.domain([ir_data[0].frequency, ir_data[ir_data.length - 1].frequency]);
  y.domain([0, d3.max(ir_data, function(d) { return d.value; })]);
  area.y0(y(0));
  svg.append("linearGradient")
    .attr("id", "temperature-gradient")
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("x1", 0).attr("y1", y(0))
    .attr("x2", width).attr("y2", y(1))
  .selectAll("stop")
    .data([
      {offset: "0%", color: "steelblue"},
      {offset: "50%", color: "gray"},
      {offset: "100%", color: "red"}
    ])
  .enter().append("stop")
    .attr("offset", function(d) { return d.offset; })
    .attr("stop-color", function(d) { return d.color; });

   // Add the area.
  svg.append("path")
    .data([ir_data])
    .attr("class", "area")
    .attr("d", area);

  svg.append("g")
    .attr("class", "grid")
    .attr("transform", "translate(0," + height + ")")
    .call(make_x_gridlines()
      .tickSize(-height)
        .tickFormat("")
    )

   // Add the X Axis
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .attr("class", "axisWhite")
    .append("text")
    .attr("transform", "translate(" + ( width - 60 ) + ", -10)")
    .attr("class", 'legend')
    .text("Wavelength");
   // Add the Y Axis
  svg.append("g")
    .call(d3.axisLeft(y))
    .attr("class", "axisWhite")
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .attr("class", 'legend')
    .text("Transmitance");

}
