/**!
 * File audio-synthesis.js
 */


function make_sound( transmitanceHit ) {

    var synth = new Tone.PolySynth(3, Tone.Synth, {
        'oscillator' : {
          'type' : 'fatsawtooth',
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
    var now = Tone.now();

    for ( var n = 1; n < transmitanceHit.length; n++ ) {

        var time =  transmitanceHit[n].transmitance;
        var note = {
          'note': new Tone.Frequency(transmitanceHit[n].frequency, 'midi').toNote(),
          'time': time
        };
        notes.push(note);
        duration = duration + time;

        //console.log( ir_data[n].value + '<' + ir_data[n-1].value );

    }
    //console.log(transmitanceThreshold);
    console.log(notes);


    var part = new Tone.Part(function(time, note){
			synth.triggerAttackRelease(note.note, now + note.time, time, 1);
		}, notes);

    part.start(now);
    part.stop(now + duration);

    Tone.Transport.start();

}
