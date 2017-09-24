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

  var x = d3.scaleLinear().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  var line = d3.line()
      .x(function(d) { return x(d.frequency); })
      .y(function(d) { return y(d.value); });

  var svg = d3.select("body #canvas-wrapper").append("svg").attr('class', 'line-chart')
      .datum(ir_data)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x.domain([ir_data[0].frequency, ir_data[ir_data.length - 1].frequency]);
  y.domain([0, d3.max(ir_data, function(d) { return d.value; })]);
   // Add the valueline path.
  svg.append("path")
    .data([ir_data])
    .attr("class", "line")
    .attr("d", line);
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
