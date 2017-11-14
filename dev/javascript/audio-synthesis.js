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

// Fire play function or stop on click event on play/stop button
playButton.addEventListener('click', function(e) {

  if( part.state == "started") {
    Tone.Transport.stop();

    playButton.classList = '';
    playButton.innerHTML = '<span class="play"></span> Play';
    part.stop(0);
    Tone.Transport.stop();



  } else if( part.state !== 'started') {
    Tone.Transport.stop();

    //make_sound();
    play_sound();

    playButton.classList = 'active';
    playButton.innerHTML = '<span class="stop"></span> Stop';

    part.start();

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
    for ( var n = 1; n < transmitanceHit.length; n++ ) {

        // Transmitance value is use to mode note duration
        // we have to round it for better performance
        var time =  Math.round(1000*transmitanceHit[n].transmitance)/1000;
        // Change the frequency value according to transpose value
        // 1 octave = 20hertz
        var finalNote = transmitanceHit[n].frequency + ( transpose * 180);
        var note = {
          'pitch_octave_note': new Tone.Frequency(finalNote, 'midi').toNote(),
          'frequency_note': finalNote,
          'time': time
        };
        console.log( note.frequency_note + ' => ' + finalNote );
        var visualNote = document.createElement('span');
        visualNote.id = 'note-' + n;
        visualNote.innerHTML = note.pitch_octave_note;
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

      if( playedNote ) {

          playedNote.classList = 'played';

          // Trigger the note with the synth
          synth.triggerAttackRelease(note.frequency_note, (time + note.time), time, .15);

          // Loop through every note
          currentTime = currentTime + note.time;
          currentNote++;

      }

    }, notes);
    // part.start(0);
    // part.loopEnd = '1m';
    // part.stop(now + duration);

    Tone.Transport.start();
}
