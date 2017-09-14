/**
 * Infrared spectrum reinterpretation
 *
 * @link https://github.com/nclslbrn/infrared-spectrum-reinterpretation
 * @author Nicolas Lebrun
 */

 /**
 * spectrum starts at:
  - ethanol 392.049000
  - water 388.677000

  and ends at
  - ethanol 3782.943472
  - water 3798.584862
  */


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
function filter_JDX_data(data) {

  //split raw text by line
  var lines = data.split( "\n" );

  // loop throught each line
  for( var n = 0; n <= lines.length; n++ ) {

    // Check if line doesn't begin with a #
    // It is not a comment
    if( lines[n].charAt(0) !== "#" ) {

      console.log( lines[n] );

    } else {
      // Show data origin and comments
      var container = document.getElementById('data-comments');
      var content = document.createElement('p');
      content.innerHTML = lines[n];
      container.appendChild( content );
    }
  }
}
get_JDX_data('_jcamp/64-17-5-IR.jdx',  filter_JDX_data);


function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(24);
  smooth(1);
  pixelDensity(1);
  background(220);
}
function draw() {

}
