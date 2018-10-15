
// Init code
if (!navigator.getUserMedia) {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
  }

window.AudioContext = window.AudioContext || window.webkitAudioContext;

var middleA = 440;

// Musical helper-functions
function noteToFrequency(note) {
    return middleA * (2 ** (1 / 12)) ** (note - 57);
}

function frequencyToNote(f) {
    return Math.round(12 * Math.log2(f / middleA) + 57);
}

function noteToOctave(note) {
    return Math.floor((note + 8) / 12);
}

function noteToKey(note) {
    return (note - 4) % 12 + 1;
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
input.setFrequency(noteToFrequency(40));
