/**!
 * File audio-synthesis.js
 */

var frequencyRange = { min: 0, max: 1200 };

var oscillatorTypeDropdown = document.getElementById('oscillator-type-dropdown');
var oscillatorsType        = Array.prototype.slice.call(oscillatorTypeDropdown.getElementsByClassName('link'));
var oscillatorTypeLabel    = document.getElementById('current-oscillator-type-output');
var oscillatorTypeName     = null;
var sequenceContainer      = document.getElementById('resulted-sequence');
var playButton             = document.getElementById('playSound');

oscillatorsType.forEach( function( oscillator ) {

 		oscillator.addEventListener('click', function(e){

 			  var oscillatorTypeName = this.getAttribute('data-oscillator');
        oscillatorTypeLabel.innerHTML = oscillatorTypeName;

    }, false);
});

if( !oscillatorTypeName ) {

  oscillatorTypeName = 'pwm';
  oscillatorTypeLabel.innerHTML = oscillatorTypeName;

}

playButton.addEventListener('click', function(e) {

  make_sound();

  if( playButton.classList.contains('active')) {

    make_sound();
    playButton.innerHTML = 'Stop';
    playButton.classList = 'active';
    
  } else {

    Tone.Transport.stop();

  }
});


function make_sound() {

    var synth = new Tone.PolySynth(3, Tone.Synth, {
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

    var notes = [];
    var duration = 0;

    for ( var n = 1; n < transmitanceHit.length; n++ ) {

        var time =  Math.round(1000*transmitanceHit[n].transmitance)/1000;

        var note = {
          //'note': new Tone.Frequency(transmitanceHit[n].frequency, 'midi').toNote(),
          'note': transmitanceHit[n].frequency,
          'time': time
        };

        notes.push(note);
        duration = duration + time;

    }

    //console.log(notes);
    sequenceContainer.innerHTML = '';

    var now = Tone.now();
    var currentTime = now;
    var currentNote = 0;
    var part = new Tone.Part( function(time, note) {

      var visualNote = document.createElement('span');
      visualNote.innerHTML = note.note;
      visualNote.style.width = ((note.time / duration) * 100) + '%';
      sequenceContainer.appendChild( visualNote );

			synth.triggerAttackRelease(note.note, (time + note.time), time);

      currentTime = currentTime + note.time;
      currentNote++;

		}, notes);



    part.start(0);
    part.loopEnd = '1m';
    part.stop(now + duration);

    Tone.Transport.start();

}
