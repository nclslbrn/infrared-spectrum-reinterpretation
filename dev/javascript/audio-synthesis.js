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
