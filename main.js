
// Init code
if (!navigator.getUserMedia) {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
  }

window.AudioContext = window.AudioContext || window.webkitAudioContext;

class Mode {

    constructor(intervals) {
        
        this.intervals = intervals;

    }

    getInterval(note) {
        return this.intervals[note - 1];
    }

    getFullInterval(note) {
        var interval = 0;
        for (let i = 0; i <= note; i++) {
            interval += this.intervals[i % this.intervals.length];
        }
        return interval;
    }

}

var config = {
    constants: {
        middleA: 440,
        names: [
            ['a', 1],
            ['b', 3],
            ['h', 3],
            ['c', 4],
            ['d', 6],
            ['e', 8],
            ['f', 9],
            ['g', 11]
        ],
        modes: [
            new Mode([2, 2, 1, 2, 2, 2, 1]), // Inionian (I)
            new Mode([2, 1, 2, 2, 2, 1, 2]), // Dorian (II)
            new Mode([1, 2, 2, 2, 1, 2, 2]), // Phrygian (III)
            new Mode([2, 2, 2, 1, 2, 2, 1]), // Lydian (IV)
            new Mode([2, 2, 1, 2, 2, 1, 2]), // Myxolodian (V)
            new Mode([2, 1, 2, 2, 1, 2, 2]), // Aeolian (VI)
            new Mode([1, 2, 2, 1, 2, 2, 2]), // Locrian (VII)
        ]
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
            var key = 12 * exp[3] - 4;
            config.constants.names.forEach(name => {
                if (name[0] == exp[1].toLowerCase()) {
                    key += name[1];
                }
            });

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
        return Math.floor((this.key + 3) / 12);
    }

    getNote() {
        return (this.key + 3) % 12 + 1;
    }

    getFrequency() {
        return config.constants.middleA * (2 ** (1 / 12)) ** (this.key - 57);
    }

    getExactFrequency() {
        return this.getFrequency() + this.offset;
    }

    getNames() {
        var notes = [];
        config.constants.names.forEach(name => {
            if (name[1] == this.getNote()) {
                notes.push(name[0]);
            }
            else if (name[1] - 1 == this.getNote()) {
                notes.push(name[0] + "b");
            }
            else if (name[1] + 1 == this.getNote()) {
                notes.push(name[0] + "#");
            }
        });
        for (let i = 0; i < notes.length; i++) {
            if (notes[i] == "hb") {
                notes[i] = "b";
            }
            notes[i] += this.getOctave();
        }

        return notes;
    }
}

class Scale {

    constructor(root, length) {

        if (root instanceof Note) {
            this.root = root;
        }
        else {
            throw "Root is not a Note!";
        }

        this.length = length;
        this.notes = [this.root];
    }

    getRoot() {
        return this.root;
    }

    getNotes() {
        return this.notes;
    }
}

    class StandardScale extends Scale {

        constructor(root, length, mode) {

            super(root, length);
            if (mode instanceof Mode) {
                this.mode = mode;
            }
            else {
                throw "Mode is not a Mode!";
            }

            for (let i = 1; i < this.length; i++) {
                var note = new Note('key', this.root.getKey() + mode.getFullInterval(i));
                this.notes.push(note);
            }

        }

    }

// Audio and Sound code
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
