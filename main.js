
// Init code
if (!navigator.getUserMedia) {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
  }

window.AudioContext = window.AudioContext || window.webkitAudioContext;

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
       this.output.frequency(f); 
    }
}

// Testing
var output = new AudioOutput();
var input = new SoundGenerator(output);

output.setInput(input);
