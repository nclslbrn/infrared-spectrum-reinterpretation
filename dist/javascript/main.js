/**
 * Infrared spectrum reinterpretation
 *
 * @link https://github.com/nclslbrn/infrared-spectrum-reinterpretation
 * @author Nicolas Lebrun
 * @license MIT
 * @version 1.0.0
 */

var molecule_ir_data = new Array();
var molecule_select = document.getElementById('molecule-select');

get_JDX_data = function loadJDX(filePath, success, error) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {

		if (xhr.readyState === XMLHttpRequest.DONE) {
			if (xhr.status === 200) {
				if (success)
					success(xhr.responseText);
		} else {
			if (error)
				error(xhr);
			}
		}
	};
	xhr.open("GET", filePath, true);
	xhr.send();
}
/**
 * Filter Data
 * @param data a string with the whole file
 * @param line Line : Frequency + " " +  Transmitance + " " +Absorbance
 */
function filter_JDX_data(data) {
	molecule_ir_data = new Array();
  //split raw text by line
  var lines = data.split( "\n" );

  // loop throught each line (-1 = don't get the last blank line)
  for( var n = 0; n < lines.length - 1; n++ ) {

		//Line is not empty
		if( typeof(lines[n]) !== undefined && lines[n] !== '') {

			// Check if first character of the line
			var firstChar = lines[n].charAt(0);

	    // is a number, so it is not a comment
	    if( firstChar % 1 === 0 ) {

				var data_column = lines[n].split(" ");

				// Store data in global var
				molecule_ir_data.push({
					frequency: data_column[0],
					value: data_column[1]
				});

	    } else {

	      // Show data origin and comments
	      var container = document.getElementById('data-comments');
	      var content = document.createElement('p');

				// But delete the two first # before adding to the html markup
				if( firstChar == "#" ) {
					content.innerHTML = lines[n].substring(2);
				} else {
					content.innerHTML = lines[n];
				}
	      container.appendChild( content );
	    }
		}
  }
	// Once the whole document is parsed fire our
	// function to make a chart
	chart_this( molecule_ir_data );
}

molecule_select.onchange = function () {
	var elem = (typeof this.selectedIndex === "undefined" ? window.event.srcElement : this);
  var file = elem.value || elem.options[elem.selectedIndex].value;

	document.getElementById('canvas-wrapper').innerHTML = "";
	document.getElementById('data-comments').innerHTML = "";

	get_JDX_data(file,  filter_JDX_data);
}

get_JDX_data('_jcamp/111-65-9-IR.jdx',  filter_JDX_data);

var container_name = 'canvas-wrapper';
var container = document.getElementById(container_name);
var canvas;

function setup(){
  canvas = createCanvas(container.offsetWidth, 800);
  canvas.parent(container_name);
}

function draw(){
  background(0);

  molecule_ir_data.forEach( function( data ) {
    console.log( data.value );
  });
}

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