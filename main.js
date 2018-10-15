
// Init code
if (!navigator.getUserMedia) {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
  }

window.AudioContext = window.AudioContext || window.webkitAudioContext;

var config = {
    constants: {
        middleA: 440,
        names: {
            'a': 1,
            'b': 3,
            'h': 3,
            'c': 4,
            'd': 6,
            'e': 8,
            'f': 9,
            'g': 11
        }
    }
} 

// Musical helper-functions
class Note {

    constructor(mode, note) {
        this.offset = 0;

        if (mode == "key") {
            var key = note;
        }
        if (mode == "octave") {
            var key = note[0] + (note[1] - 1) * 12 + 3;
        }
        if (mode == "frequency") {
            var key = Math.round(12 * Math.log2(note / config.constants.middleA) + 57);
            this.offset = note - (config.constants.middleA * (2 ** (1 / 12)) ** (key - 57));
        }
        if (mode == "name") {
            var exp = /([a-hA-H])([#b]?)(\d)/.exec(note);
            var key = 12 * exp[3] + config.constants.names[exp[1].toLowerCase()];

            if (exp[2] == "#") {
                key++;
            }
            if (exp[2] == "b") {
                key--;
            }
        }

        if (1 <= key && 88 >= key) {
            this.key = key;
        }
        else {
            throw "Note is out of range!";
        }
    }

    getKey() {
        return this.key;
    }

    getOctave() {
        return Math.floor((this.key + 8) / 12);
    }

    getNote() {
        return (note - 4) % 12 + 1;
    }

    getFrequency() {
        return middleA * (2 ** (1 / 12)) ** (note - 57);
    }

    getExactFrequency() {
        return this.getFrequency() + this.offset;
    }

}

class AudioOutput {

    constructor() {
        this.context = new AudioContext();
    }

    setInput(input) {
        input.output.connect(this.context.destination);
    }
}

class SoundGenerator {

    constructor(output) {
        this.output = output.context.createOscillator();
        this.output.start();
    }

    setFrequency(f) {
        this.output.frequency.setValueAtTime(f, output.context.currentTime); 
    }
}

// Testing
var output = new AudioOutput();
var input = new SoundGenerator(output);

output.setInput(input);
//input.setFrequency(noteToFrequency(40));
