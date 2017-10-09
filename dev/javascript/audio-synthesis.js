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
