/**
 * Infrared spectrum reinterpretation
 *
 * @link https://github.com/nclslbrn/infrared-spectrum-reinterpretation
 * @author Nicolas Lebrun
 * @license MIT
 * @version 1.0.0
 */

var molecule_ir_data = new Array();
var transmitanceHit = [];
var moleculeDropdown = document.getElementById('molecule-dropdown');

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
									frequency: parseFloat(data_column[0]),
									value: parseFloat(data_column[1])
								});

				    } else {

					      // Show data origin and comments
					      var container = document.getElementById('data-comments');
								var modal = document.getElementById('comment-source-file-modal');
								var extract = document.createElement('p');
								var content = document.createElement('p');

								// But delete the two first # before adding to the html markup
								if( firstChar == "#" ) {

										if( n < 9 ) {
												extract.innerHTML = lines[n].substring(2);
										}

										content.innerHTML = lines[n].substring(2);


								} else {

										if( n < 9 ) {
												extract.innerHTML = lines[n].substring(2);
										}

										content.innerHTML = lines[n];

								}
					      container.append( extract );
								modal.appendChild( content );
				    }
				}
	  }
		// Once the whole document is parsed

		//get transmitance hit (depends to threshold slider value)
		transmitanceHit = getTransmitanceHit( molecule_ir_data )

		// fire our function to make a chart
		chart_this( molecule_ir_data );

		// fire our function to make sound
		make_sound( transmitanceHit );
}

var molecules_entry = Array.prototype.slice.call(moleculeDropdown.getElementsByClassName('link'));

molecules_entry.forEach( function( molecule ) {

		molecule.addEventListener('click', function(e){

			  var file = this.getAttribute('data-file');
				document.getElementById('canvas-wrapper').innerHTML = "";
				document.getElementById('data-comments').innerHTML = "";

				get_JDX_data(file,  filter_JDX_data);

		}, false);
});


get_JDX_data('data/7732-18-5-IR.jdx',  filter_JDX_data);

function getTransmitanceHit( molecule_ir_data ) {

		var transmitanceThreshold = document.getElementById('transmitanceThreshold').value / 1000;
		var ir_data = Array.prototype.slice.call(molecule_ir_data);
		var transmitanceHit = [];

		for ( var n = 1; n < ir_data.length; n++ ) {

	      if(
	        ir_data[n].value  > ( ir_data[n-1].value + transmitanceThreshold )
	        ||
	        ir_data[n].value  < ( ir_data[n-1].value - transmitanceThreshold )
	      ) {

					var hit = {
						transmitance: ir_data[n].value,
						frequency: ir_data[n].frequency
					};

					transmitanceHit.push( hit );

				}
		}

		return transmitanceHit;
}
