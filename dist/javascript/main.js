/**!
 * File audio-synthesis.js
 */

function make_sound( molecule_ir_data ) {

    var band = flock.band({
        components: {
            sinSynth: {
                type: "flock.synth",
                options: {
                    synthDef: {
                        id: "carrier",
                        ugen: "flock.ugen.sinOsc",
                        freq: 220,
                        mul: {
                            ugen: "flock.ugen.line",
                            start: 0,
                            end: 0.25,
                            duration: 1.0
                        }
                    }
                }
            },

            scheduler: {
                type: "flock.scheduler.async",
                options: {
                    components: {
                        synthContext: "{sinSynth}"
                    },

                    score: [
                        {
                            interval: "repeat",
                            time: 1.0,
                            change: {
                                values: {
                                    "carrier.freq": {
                                        synthDef: {
                                            ugen: "flock.ugen.sequence",
                                            values: [330, 440, 550, 660, 880, 990, 1100, 1210]
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        }
    });

    // Fade out after 8 seconds.
    band.scheduler.once(8, function () {
        band.sinSynth.set({
            "carrier.mul.start": 0.25,
            "carrier.mul.end": 0.0,
            "carrier.mul.duration": 1.0
        });
    });
}

/**!
 * File: dropdown.js
 */

var dropdowns =  Array.prototype.slice.call(document.getElementsByClassName('dropdown-button'));

dropdowns.forEach(function( dropdown ) {

    var links = Array.prototype.slice.call(document.getElementsByClassName('link'));

    dropdown.addEventListener('click', function(e){

        e.preventDefault();
        this.parentElement.classList.toggle('active');

    }, false);

    links.forEach(function( link ) {

        link.addEventListener('click', function(e){

            e.preventDefault();
            this.parentElement.parentElement.parentElement.parentElement.classList.toggle('active');

        });
    });
});

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
		make_sound( molecule_ir_data );
}

var molecules_entry = Array.prototype.slice.call(molecule_select.getElementsByClassName('link'));

molecules_entry.forEach( function( molecule ) {

		molecule.addEventListener('click', function(e){

			  var file = this.getAttribute('data-file');
				document.getElementById('canvas-wrapper').innerHTML = "";
				document.getElementById('data-comments').innerHTML = "";

				get_JDX_data(file,  filter_JDX_data);

		}, false);
});


get_JDX_data('data/111-65-9-IR.jdx',  filter_JDX_data);

/**!
 * File: p5_interpreter.js
 */
/*
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
*/

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
