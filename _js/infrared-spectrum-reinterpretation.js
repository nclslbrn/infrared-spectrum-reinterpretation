/**
 * Infrared spectrum reinterpretation
 *
 * @link https://github.com/nclslbrn/infrared-spectrum-reinterpretation
 * @author Nicolas Lebrun
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
