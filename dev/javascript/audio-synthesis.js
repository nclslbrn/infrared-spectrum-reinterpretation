/**!
 * File audio-synthesis.js
 */


function make_sound( molecule_ir_data ) {
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

    var ir_data = Array.prototype.slice.call(molecule_ir_data);
    var transmitanceThreshold = document.getElementById('transmitanceThreshold').value / 1000;
    var notes = [];

    //console.log(transmitanceThreshold);
    for ( var n = 1; n < ir_data.length; n++ ) {

      if(
        ir_data[n].value  > ( ir_data[n-1].value + transmitanceThreshold )
        ||
        ir_data[n].value  < ( ir_data[n-1].value - transmitanceThreshold )
      ) {

        synth.triggerAttackRelease(
          ir_data[n].frequency,
          Math.round(ir_data[n].value * 10) + 'n',
          1
        );

        var note = {
          'note': new Tone.Frequency(ir_data[n].frequency, 'midi').toNote(),
          'time':  Math.round(ir_data[n].value * 10) + 'n'
        };
        notes.push(note);
        console.log( ir_data[n].value + '<' + ir_data[n-1].value );
      }
    }
    console.log(transmitanceThreshold);
    console.log(notes.length);

    /*
    ir_data.forEach( function(d) {

        if(d.value > .7) {

            synth.triggerAttackRelease(
              d.frequency,
              Math.round(d.value * 10) + 'n',
              1
            );

            var note = {
              'note': new Tone.Frequency(d.frequency, 'midi').toNote(),
              'time':  Math.round(d.value * 10) + 'n'
            };
            notes.push(note);
        }

    });
    */
/*
    var part = new Tone.Part(function(time, note){
			synth.triggerAttackRelease(notes.note, notes.time, time, 1);
		}, notes).start(0);
*/
//    Tone.Transport.start();
}
