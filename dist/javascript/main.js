/**!
 * File audio-synthesis.js
 */
var synth                  = null;
var frequencyRange         = { min: 0, max: 1200 };
var part                   = new Tone.Part();
var notes                  = [];
var duration               = 0;
var oscillatorTypeName     = null;

var oscillatorTypeDropdown = document.getElementById('oscillator-type-dropdown');
var oscillatorsType        = Array.prototype.slice.call(oscillatorTypeDropdown.getElementsByClassName('link'));
var oscillatorTypeLabel    = document.getElementById('current-oscillator-type-output');

var sequenceContainer      = document.getElementById('resulted-sequence');

var playButton             = document.getElementById('playSound');

var transposeSlider        = document.getElementById('transpose');
var transpose              = transposeSlider.value;
var transposeOutput        = document.getElementById('transposeOutput');

var totalTimeLabel         = document.getElementById('total-time');
// Detect change in oscillator type dropdown
oscillatorsType.forEach( function( oscillator ) {

 		oscillator.addEventListener('click', function(e){

 			  var oscillatorTypeName = this.getAttribute('data-oscillator');
        oscillatorTypeLabel.innerHTML = oscillatorTypeName;

    }, false);
});

// Set a default oscillator if no one is choosed
if( !oscillatorTypeName ) {

  oscillatorTypeName = 'pwm';
  oscillatorTypeLabel.innerHTML = oscillatorTypeName;

}
function stopPart() {
  Tone.Transport.stop();
  console.log('stopPart() used');
}

function play_button_behaviour(state) {

  if( state == 'stopped' ) {

    playButton.dataset.state = 'start';
    playButton.innerHTML = '<span class="play"></span> Play';

  } else if( state == 'started' ) {

    playButton.dataset.state = 'stop';
    playButton.innerHTML = '<span class="stop"></span> Stop';
    part.start();
  }
}
// Fire play function or stop on click event on play/stop button
playButton.addEventListener('click', function(e) {

  if( playButton.dataset.state == 'start' ) {

    Tone.Transport.stop();
    play_sound();
    play_button_behaviour('started');

  } else if( playButton.dataset.state == 'stop' ) {

    part.stop(0);
    Tone.Transport.stop(0);
    play_button_behaviour('stopped');
  }

});
// Change sequence frequency value when user change the transpose value
transposeSlider.addEventListener('input', function() {

    Tone.Transport.stop();
		transpose = Number(transposeSlider.value);
    transposeOutput.innerHTML = transpose;


}, false);

// Build or rebuild the sound
transposeSlider.addEventListener('mouseup', function() {
    make_sound();
});

// Init the synth and load sequence into `notes`
function make_sound() {

    sequenceContainer.innerHTML = '';
    for ( var n = 1; n < transmitanceHit.length; n++ ) {

      var time =  Math.round(1000*transmitanceHit[n].transmitance)/1000;
      duration = duration + time;
    }
    if( duration > 1.99 ) {
      totalTimeLabel.innerHTML = duration + ' <span>seconds</span>';
    } else {
      totalTimeLabel.innerHTML = duration + ' <span>second</span>';
    }

    for ( var n = 1; n < transmitanceHit.length; n++ ) {

        // Transmitance value is use to mode note duration
        // we have to round it for better performance
        var time =  (Math.round(1000*transmitanceHit[n].transmitance * stepDurationFactor)/1000);
        // Change the frequency value according to transpose value
        // 1 octave = 20hertz

        var finalNote = transmitanceHit[n].frequency + ( transpose * 360);
        var note = {
          'pitch_octave_note': new Tone.Frequency(finalNote, 'midi').toNote(),
          'frequency_note': finalNote,
          'time': time
        };
        // console.log( note.frequency_note + ' => ' + finalNote );
        var visualNote = document.createElement('span');
        visualNote.id = 'note-' + n;
        visualNote.innerHTML = note.frequency_note;
        visualNote.style.width = ((note.time / duration) * 100) + '%';

        sequenceContainer.appendChild( visualNote );

        notes.push(note);
    }
}

// Play sound and change the background color
// of played note into sequenceContainer
function play_sound() {
  synth = new Tone.MonoSynth({
      'oscillator' : {
        'type' : oscillatorTypeName,
        'count' : 3,
        'spread' : 30
      },
      'envelope': {
        'attack': 0.01,
        'decay': 0.1,
        'sustain': 0.5,
        'release': 0.4,
        'attackCurve' : 'exponential'
      },
    }).toMaster();
    // Remove played class in case of replay
    var everyVisualNotes = Array.prototype.slice.call(sequenceContainer.getElementsByTagName('span'));
    everyVisualNotes.forEach( function(visualNote){
        visualNote.classList = '';
    });

    var now = Tone.now();
    var currentTime = now;
    var currentNote = 1;

    part = new Tone.Part( function(time, note) {

      // Highlight the current note on the sequence container
      var playedNoteId = 'note-' + currentNote;
      var playedNote = document.getElementById(playedNoteId);

      if( playedNote && playButton.dataset.state == 'stop') {

          playedNote.classList = 'played';

          // Trigger the note with the synth
          synth.triggerAttackRelease(note.frequency_note, (time + note.time), time, .15);

          // Loop through every note
          currentTime = currentTime + note.time;
          currentNote++;

      }
      Tone.Transport.schedule(function(time){
        	//use the time argument to schedule a callback with Tone.Draw
        	Tone.Draw.schedule(function(){

            play_button_behaviour('stopped');

        	}, time)
      }, time);

    }, notes);

    // part.loop = 8;
    // part.humanize = 'true';
    // part.stop(now + duration);

    Tone.Transport.start();
}

/**
 * @author mrdoob / http://mrdoob.com/
 */

var APP = {

	Player: function () {

		var loader = new THREE.ObjectLoader();
		var camera, scene, renderer;

		var events = {};

		var dom = document.createElement( 'div' );

		this.dom = dom;

		this.width = 500;
		this.height = 500;

		this.load = function ( json ) {

			renderer = new THREE.WebGLRenderer( { antialias: true } );
			renderer.setClearColor( 0x000000 );
			renderer.setPixelRatio( window.devicePixelRatio );

			var project = json.project;

			if ( project.gammaInput ) renderer.gammaInput = true;
			if ( project.gammaOutput ) renderer.gammaOutput = true;
			if ( project.shadows ) renderer.shadowMap.enabled = true;
			if ( project.vr ) renderer.vr.enabled = true;

			dom.appendChild( renderer.domElement );

			this.setScene( loader.parse( json.scene ) );
			this.setCamera( loader.parse( json.camera ) );

			events = {
				init: [],
				start: [],
				stop: [],
				keydown: [],
				keyup: [],
				mousedown: [],
				mouseup: [],
				mousemove: [],
				touchstart: [],
				touchend: [],
				touchmove: [],
				update: []
			};

			var scriptWrapParams = 'player,renderer,scene,camera';
			var scriptWrapResultObj = {};

			for ( var eventKey in events ) {

				scriptWrapParams += ',' + eventKey;
				scriptWrapResultObj[ eventKey ] = eventKey;

			}

			var scriptWrapResult = JSON.stringify( scriptWrapResultObj ).replace( /\"/g, '' );

			for ( var uuid in json.scripts ) {

				var object = scene.getObjectByProperty( 'uuid', uuid, true );

				if ( object === undefined ) {

					console.warn( 'APP.Player: Script without object.', uuid );
					continue;

				}

				var scripts = json.scripts[ uuid ];

				for ( var i = 0; i < scripts.length; i ++ ) {

					var script = scripts[ i ];

					var functions = ( new Function( scriptWrapParams, script.source + '\nreturn ' + scriptWrapResult + ';' ).bind( object ) )( this, renderer, scene, camera );

					for ( var name in functions ) {

						if ( functions[ name ] === undefined ) continue;

						if ( events[ name ] === undefined ) {

							console.warn( 'APP.Player: Event type not supported (', name, ')' );
							continue;

						}

						events[ name ].push( functions[ name ].bind( object ) );

					}

				}

			}

			dispatch( events.init, arguments );

		};

		this.setCamera = function ( value ) {

			camera = value;
			camera.aspect = this.width / this.height;
			camera.updateProjectionMatrix();

			if ( renderer.vr.enabled ) {

				dom.appendChild( WEBVR.createButton( renderer ) );

			}

		};

		this.setScene = function ( value ) {

			scene = value;

		};

		this.setSize = function ( width, height ) {

			this.width = width;
			this.height = height;

			if ( camera ) {

				camera.aspect = this.width / this.height;
				camera.updateProjectionMatrix();

			}

			if ( renderer ) {

				renderer.setSize( width, height );

			}

		};

		function dispatch( array, event ) {

			for ( var i = 0, l = array.length; i < l; i ++ ) {

				array[ i ]( event );

			}

		}

		var prevTime;

		function animate( time ) {

			try {

				dispatch( events.update, { time: time, delta: time - prevTime } );

			} catch ( e ) {

				console.error( ( e.message || e ), ( e.stack || "" ) );

			}

			renderer.render( scene, camera );

			prevTime = time;

		}

		this.play = function () {

			prevTime = performance.now();

			document.addEventListener( 'keydown', onDocumentKeyDown );
			document.addEventListener( 'keyup', onDocumentKeyUp );
			document.addEventListener( 'mousedown', onDocumentMouseDown );
			document.addEventListener( 'mouseup', onDocumentMouseUp );
			document.addEventListener( 'mousemove', onDocumentMouseMove );
			document.addEventListener( 'touchstart', onDocumentTouchStart );
			document.addEventListener( 'touchend', onDocumentTouchEnd );
			document.addEventListener( 'touchmove', onDocumentTouchMove );

			dispatch( events.start, arguments );

			renderer.animate( animate );

		};

		this.stop = function () {

			document.removeEventListener( 'keydown', onDocumentKeyDown );
			document.removeEventListener( 'keyup', onDocumentKeyUp );
			document.removeEventListener( 'mousedown', onDocumentMouseDown );
			document.removeEventListener( 'mouseup', onDocumentMouseUp );
			document.removeEventListener( 'mousemove', onDocumentMouseMove );
			document.removeEventListener( 'touchstart', onDocumentTouchStart );
			document.removeEventListener( 'touchend', onDocumentTouchEnd );
			document.removeEventListener( 'touchmove', onDocumentTouchMove );

			dispatch( events.stop, arguments );

			renderer.animate( null );

		};

		this.dispose = function () {

			while ( dom.children.length ) {

				dom.removeChild( dom.firstChild );

			}

			renderer.dispose();

			camera = undefined;
			scene = undefined;
			renderer = undefined;

		};

		//

		function onDocumentKeyDown( event ) {

			dispatch( events.keydown, event );

		}

		function onDocumentKeyUp( event ) {

			dispatch( events.keyup, event );

		}

		function onDocumentMouseDown( event ) {

			dispatch( events.mousedown, event );

		}

		function onDocumentMouseUp( event ) {

			dispatch( events.mouseup, event );

		}

		function onDocumentMouseMove( event ) {

			dispatch( events.mousemove, event );

		}

		function onDocumentTouchStart( event ) {

			dispatch( events.touchstart, event );

		}

		function onDocumentTouchEnd( event ) {

			dispatch( events.touchend, event );

		}

		function onDocumentTouchMove( event ) {

			dispatch( events.touchmove, event );

		}

	}

};

/**!
 * File: dropdown.js
 */

var dropdowns =  Array.prototype.slice.call(document.getElementsByClassName('dropdown-button'));

dropdowns.forEach(function( dropdown ) {

    var links = Array.prototype.slice.call(document.getElementsByClassName('link'));

    dropdown.addEventListener('click', function(e){

        e.preventDefault();
        var targetId = this.parentElement.id;
        document.getElementById(targetId).classList.toggle('active');
        stopPart();

    }, false);

    links.forEach(function( link ) {

        link.addEventListener('click', function(e){

            e.preventDefault();
            var targetId = this.parentElement.parentElement.parentElement.parentElement.id;
            document.getElementById(targetId).classList.remove('active');

        });
    });
});

/**!
 * File light-synthesis.js
 */

var canvasWrapper = document.getElementById('canvas-3d-wrapper');
var canvasWidth = canvasWrapper.clientWidth;
var canvasHeight = canvasWrapper.clientHeight;

var loader = new THREE.FileLoader();
loader.load( 'data/app.json', function ( text ) {

		var player = new APP.Player();
		player.load( JSON.parse( text ) );
		player.setSize( canvasWidth, canvasHeight );
		player.play();

		canvasWrapper.appendChild( player.dom );
		window.addEventListener( 'resize', function () {
				player.setSize( window.innerWidth, window.innerHeight );
		} );
} );

/**
 * Infrared spectrum reinterpretation
 *
 * @link https://github.com/nclslbrn/infrared-spectrum-reinterpretation
 * @author Nicolas Lebrun
 * @license MIT
 * @version 1.0.0
 */

var moleculeIrData = new Array();
var transmitanceHit = [];
var moleculeDropdown = document.getElementById('molecule-dropdown');
var molecules_entry = Array.prototype.slice.call(moleculeDropdown.getElementsByClassName('link'));

var transmitanceThresholdSlider = document.getElementById('transmitanceThreshold');
var transmitanceThreshold = transmitanceThresholdSlider.value / 1000;
var transmitanceThresholdOutput = document.getElementById('transmitanceThresholdOutput');

var stepDurationFactorSlider = document.getElementById('stepDurationFactor');
var stepDurationFactor = stepDurationFactorSlider.value / 10;
var stepDurationFactorOutput = document.getElementById('stepDurationFactorOutput');

// If a molecule is selected load the file
molecules_entry.forEach( function( molecule ) {

		molecule.addEventListener('click', function(e){

			  var file = this.getAttribute('data-file');
				// reinit html markup
				document.getElementById('canvas-wrapper').innerHTML = "";
				document.getElementById('data-comments').innerHTML = "";

				get_JDX_data(file,  filter_JDX_data);
				getTransmitanceHit();
				make_sound();

		}, false);
});

// Return input range value
// 1. Transmitance threshold
transmitanceThresholdSlider.addEventListener('input', function() {
		transmitanceThreshold = transmitanceThresholdSlider.value / 1000;
    transmitanceThresholdOutput.innerHTML = transmitanceThreshold;

}, false);
transmitanceThresholdSlider.addEventListener('mouseup', function() {
		getTransmitanceHit();
		make_sound();
});

// 2. Step duration factor
stepDurationFactorSlider.addEventListener('input', function() {

		stepDurationFactor = stepDurationFactorSlider.value / 10;
    stepDurationFactorOutput.innerHTML = stepDurationFactor;

}, false);

stepDurationFactorSlider.addEventListener('mouseup', function() {
    make_sound();
});


// Gt the content of the .jdx file
get_JDX_data = function loadJDX(filePath, success, error) {

		var xhr = new XMLHttpRequest();
		xhr.overrideMimeType('text/plain');
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

// Load a default file
// Usefull for development
get_JDX_data('data/7732-18-5-IR.jdx',  filter_JDX_data);

// Filter the source file
function filter_JDX_data(data) {

		moleculeIrData = new Array();
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
								moleculeIrData.push({
									frequency: parseFloat(data_column[0]),
									value: parseFloat(data_column[1])
								});

				    } else {

					      // Show data origin and comments
					      var container = document.getElementById('data-comments');
								var modal 		= document.getElementById('comment-source-file-modal');
								var extract 	= document.createElement('p');
								var content 	= document.createElement('p');

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
		getTransmitanceHit();

		// fire our function to make a chart
		chart_this( moleculeIrData );

		// fire our function to make sound
		make_sound();
}


function getTransmitanceHit() {

		var ir_data = Array.prototype.slice.call(moleculeIrData);
		// reinit var
		transmitanceHit = [];

		for ( var n = 1; n < ir_data.length; n++ ) {

	      if(
	        ir_data[n].value  > ( ir_data[n-1].value + transmitanceThreshold )
	        ||
	        ir_data[n].value  < ( ir_data[n-1].value - transmitanceThreshold )
	      ) {

					var hit = {
						transmitance: ir_data[n].value,
						frequency: Math.round(ir_data[n].frequency)
					};

					transmitanceHit.push( hit );

				}
		}

		return transmitanceHit;
}

/**!
 * File: modal.js
 */

var modalButtons =  Array.prototype.slice.call(document.getElementsByClassName('modal-button'));

modalButtons.forEach(function( button ) {

  button.addEventListener('click', function(e){

      e.preventDefault();
      var modalId = this.getAttribute('data-toggle');
      console.log( modalId );
      var modal = document.getElementById(modalId)
      modal.classList.toggle('active');

  }, false);

});

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

  moleculeIrData.forEach( function( data ) {
    console.log( data.value );
  });
}
*/

/**!
 * File: wavelength.js
 */

function chart_this( moleculeIrData ) {

  var ir_data = Array.prototype.slice.call(moleculeIrData);
  var container = document.getElementById('canvas-wrapper');
  var button = document.getElementsByClassName('button')[0];
  var waveColor = document.defaultView.getComputedStyle( button ,null).getPropertyValue('background-color');

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

  var svg = d3.select("body #canvas-wrapper").insert("svg").attr('class', 'area-chart')
      .datum(ir_data)
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " "  + (height + margin.top + margin.bottom ) )
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
        {offset: "0%", color: waveColor },
        {offset: "50%", color: waveColor },
        {offset: "100%", color: waveColor }
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
