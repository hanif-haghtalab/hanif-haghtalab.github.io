//let canvas;
let nInt = 1; //noise intensity
let nAmp = 1; // noise Amplitude
let rad = 50;
let img1, img2, img3, img4;
// var button;
let bg;
let song;
let play = false;
//sound------------------------------------
let button;
let ready = false;
let masterVolume = -2;
let scale;
let track0, track1, track2, track3;
let reverb, delay, gain, gain2, gain3, gain4, phaser, cheby;

let sequence = [0, 2, 4, 6];

function preload() {
  //bg = loadImage(' https://cdn.glitch.global/ad124ed0-c23e-477a-8c0a-281b186122df/Logo-1.png?v=1642361902390');
  img1 = loadImage(
    "https://cdn.glitch.global/c5205c1e-207c-4242-8c39-0e722dcfe87f/Log-1-4.png?v=1677056821727"
  );
  img2 = loadImage(
    "https://cdn.glitch.global/c5205c1e-207c-4242-8c39-0e722dcfe87f/Log-2-4.png?v=1677056840723"
  );
  img3 = loadImage(
    "https://cdn.glitch.global/c5205c1e-207c-4242-8c39-0e722dcfe87f/Log-3-4.png?v=1677056847578"
  );
  img4 = loadImage(
    "https://cdn.glitch.global/c5205c1e-207c-4242-8c39-0e722dcfe87f/Log-4-4.png?v=1677056858000"
  );
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

var w = [];

let setting = {
  strokeWeight: 0.1,

  bgColor: [200, 0, 100, 2],

  // bgColor: {display:'color', value: '#3e3e3e'}
};
function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  canvas.style("z-index", -1);

  //Start the sound
  button = createButton("PLAY/STOP");
  button.position(width / 2 - button.width / 2, height - 40);
  // button.mode(CENTER,CENTER);
  button.mousePressed(startLine);

  imageMode(CENTER);
  img1.resize(width / 4, width / 4);
  img2.resize(width / 4, width / 4);
  img3.resize(width / 4, width / 4);
  img4.resize(width / 4, width / 4);

  for (var i = 0; i < 6; i++) {
    w[i] = new Walker();
  }
  //-----------------------------------------
  //sound
  scale = new Tonal.Scale.get("C4 major").notes;
}

function initializeAudio() {
  gain = new Tone.Gain(0.2).toDestination();
  reverb = new Tone.JCReverb(0.5).connect(gain);
  track0 = new Track(
    /*transpose*/ -4,
    /*noteDuration*/ "1n",
    /*tempo*/ "2n",
    "upDown",
    "fatsine",
    reverb
  );
  Tone.Master.volume.value = masterVolume;
}

let lTrigger2 = false;
let lTrigger3 = false;
let lTrigger4 = false;
let lTrigger5 = false;
function mousePressed() {
  //------------------------------------------------
  if (
    mouseX < width / 2 - img1.width / 2 &&
    mouseY < height / 2 - img1.height / 2 &&
    lTrigger2 == false
  ) {
    //---------------------------------------------
    //Sound Line 02---------------------------------
    gain2 = new Tone.Gain(0.1).toDestination();
    delay = new Tone.Delay(0.7).connect(gain2);
    track1 = new Track(
      -14,
      /*noteDuration*/ "8n",
      /*tempo*/ "8n",
      "randomWalk",
      "fatsawtooth",
      delay
    );
    lTrigger2 = true;
  } else if (
    mouseX < width / 2 - img1.width / 2 &&
    mouseY < height / 2 - img1.height / 2 &&
    lTrigger2 == true
  ) {
    gain2.disconnect(Tone.Master);
    lTrigger2 = false;
  }
  //-------------------------------------------------
  if (
    mouseX > width / 2 + img1.width / 2 &&
    mouseY < height / 2 - img1.height / 2 &&
    lTrigger3 == false
  ) {
    //Sound Line 03-----------------------------------
    //-----------------------------------------------
    gain3 = new Tone.Gain(0.5).toDestination();
    delay = new Tone.Delay(0.8).connect(gain3);
    track1 = new Track(
      -14,
      /*noteDuration*/ "1n",
      /*tempo*/ "2n",
      "up",
      "fatsine",
      delay
    );
    lTrigger3 = true;
  }
  //---------------------------------------------------------
  else if (
    mouseX > width / 2 + img1.width / 2 &&
    mouseY < height / 2 - img1.height / 2 &&
    lTrigger3 == true
  ) {
    gain3.disconnect(Tone.Master);
    lTrigger = false;
  }

  //Sound Line 04----------------------------------------------
  //-----------------------------------------------------------

  if (
    mouseX > width / 2 + img3.width / 2 &&
    mouseY > height / 2 - img3.height / 2 &&
    lTrigger4 == false
  ) {
    phaser = new Tone.Phaser({
      requency: 15,
      octaves: 5,
      baseFrequency: 1000,
    }).toDestination();
    track2 = new Track(
      /*transpose*/ 0,
      /*noteDuration*/ "4n",
      /*tempo*/ "2n",
      "alternateUp",
      "fattriangle",
      phaser
    );
    lTrigger4 = true;
  }
  //--------------------------------------------------------------
  else if (
    mouseX > width / 2 + img3.width / 2 &&
    mouseY > height / 2 - img3.height / 2 &&
    lTrigger4 == true
  ) {
    phaser.disconnect(Tone.Master);
    lTrigger4 = false;
  }

  //Sound Line 05
  //----------------------------------------------------------
  if (
    mouseX < width / 2 - img4.width / 2 &&
    mouseY > height / 2 - img4.height / 2 &&
    lTrigger5 == false
  ) {
    // image(img4, width / 2, height / 2);
    gain4 = new Tone.Gain(0.1).toDestination();
    cheby = new Tone.Chebyshev(2).connect(gain4);
    track3 = new Track(
      /*transpose*/ 7,
      /*noteDuration*/ "3n",
      /*tempo*/ "8n",
      "random",
      "sawtooth",
      cheby
    );
    lTrigger5 = true;
  }
  //---------------------------------------------------------------
  else if (
    mouseX < width / 2 - img4.width / 2 &&
    mouseY > height / 2 - img4.height / 2 &&
    lTrigger5 == true
  ) {
    gain4.disconnect(Tone.Master);
    lTrigger5 = false;
  }

  //Scale1
  //-------------------------------------------------------
}
// ll1==false;

// } else if (
//   mouseX < width / 2
//   // mouseX > width / 2 - img1.width / 2 &&
//   // mouseY < height / 2 &&
//   // mouseY > height / 2 - img.height / 2
// ) {
//   gain2.disconnect(Tone.Master);
//   fill(255);
//   circle(mouseX,mouseY,30);
//   }
// }

// function keyPressed() {
//   if (keyCode == 49) {
//     // sequence = [1, 3, 6, 9];
//   }
//   if (keyCode == 50) {
//     // sequence = [8, 6, 4, 2, -2];
//   }
//   if (keyCode == 51) {
//     // sequence = [-4, -2, 4, 6];
//   }

//   if (keyCode == 48) {
// track2 = new Track(
//   /*transpose*/ 0,
//   /*noteDuration*/ "4n",
//   /*tempo*/ "2n",
//   "alternateUp",
//   "fattriangle"
// );
//}
//   if (keyCode == 57) {
//           gain2 = new Tone.Gain(0.05).toDestination();
//     delay = new Tone.Delay(0.7).connect(gain2);
//     track1 = new Track(
//       -14,
//       /*noteDuration*/ "8n",
//       /*tempo*/ "8n",
//       "randomWalk",
//       "fatsawtooth",
//       delay
//     );
//   }
//   if (keyCode == 16) {

//     gain2.disconnect(Tone.Master);

//   }
//if (keyCode == 56) {
//   gain3 = new Tone.Gain(0.5).toDestination();
//   delay = new Tone.Delay(0.8).connect(gain3);
//   track1 = new Track(
//     -14,
//     /*noteDuration*/ "1n",
//     /*tempo*/ "2n",
//     "up",
//     "fatsine",
//     delay
//   );
// }
//}

function MapNote(noteNumber, scale) {
  let numberOfNotes = scale.length;
  let i = modulo(noteNumber, numberOfNotes);
  let note = scale[i];

  let zeroOctave = Tonal.Note.octave(scale[0]);

  let noteOctave = zeroOctave + floor(noteNumber / numberOfNotes);

  let noteName = Tonal.Note.pitchClass(note);
  return noteName + noteOctave;
}

function modulo(nN, nONs) {
  return ((nN % nONs) + nONs) % nONs;
}

function startLine() {
  if (!ready) {
    ready = true;
    Tone.Transport.start();
    initializeAudio();
  } else {
    ready = false;
    Tone.Transport.stop();
    track0.pattern.stop();
  }
}

class Track {
  /* PatternName ==> "up" | "down" | "upDown" | "downUp" | "alternateUp" | "alternateDown" | "random" | "randomOnce" | "randomWalk" */

  constructor(
    transpose = 0,
    noteDuration = "8n",
    tempo = "8n",
    patternType = "up",
    synthType = "triangle",
    effect = Tone.Master
  ) {
    this.transpose = transpose;
    this.tempo = tempo;
    this.noteDuration = noteDuration;
    this.synth = new Tone.Synth({
      oscillator: {
        type: synthType,
      },
      envelope: {
        attack: 1,
        decay: 0.2,
        sustain: 1,
        release: 0.5,
      },
    }).connect(effect);

    this.pattern = new Tone.Pattern(
      (time, index) => {
        let note = MapNote(sequence[index] + this.transpose, scale);
        this.synth.triggerAttackRelease(note, this.noteDuration, time);
        this.currentNote = note;
      },
      Array.from(sequence.keys()),
      patternType
    );
    this.pattern.interval = this.tempo;
    this.pattern.start();
    this.currentNote;
  }
}

function draw() {
  //.........................................................
  //Sound
  if (
    mouseX < width / 2 - img1.width / 2 &&
    mouseY < height / 2 - img1.height / 2 &&
    lTrigger2 == false
  ) {
    sequence = [-3, -1, 2, 4, 6];
  }
  if (
    mouseX > width / 2 + img1.width / 2 &&
    mouseY < height / 2 - img1.height / 2 &&
    lTrigger3 == false
  ) {
    sequence = [3, 6, 3, 8, 10];
  }
  if (
    mouseX > width / 2 + img3.width / 2 &&
    mouseY > height / 2 - img3.height / 2 &&
    lTrigger4 == false
  ) {
    sequence = [-4, -2, 4, 6];
  }
  if (
    mouseX < width / 2 - img4.width / 2 &&
    mouseY > height / 2 - img4.height / 2 &&
    lTrigger5 == false
  ) {
    sequence = [6, 8, 6, 6, 8];
  }

  if (ready) {
    //     let noteNumber = floor(map(mouseX,0,width,-7,14));

    //     let note = MapNote(noteNumber,scale);

    //     if(note != prevNote){
    //     synth.triggerAttackRelease(note,'2n');
    //       prevNote = note;

    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    // text(track0.currentNote, width / 2, height / 2);
    // text("CLICK TO STOP", width / 2, height - 20);
  } else {
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    // text("CLICK TO START", width / 2, height - 20);
  }
  //---------------------------------------------------

  let r = sin(frameCount * 0.005);
  let g = sin(frameCount * 0.01);
  let b = sin(frameCount * 0.001);
  let a = sin(frameCount * 0.0000001);

  let rMap = map(r, 0, 1, 0, 255);
  let gMap = map(g, 0, 1, 0, 255);
  let bMap = map(g, 0, 1, 255, 0);
  let aMap = map(g, 0, 1, 3, 1);

  background(rMap, gMap, bMap, aMap);

  picShow();
  // background=params
  for (var j = 0; j < 6; j++) {
    w[j].update();
    w[j].display();
  }
}

function Walker() {
  this.pos = createVector(width / 2, height / 2);
  this.vel = createVector(0, 0);
  //this.acc = createVector(0,0);
  this.inc = 1;

  this.update = function () {
    this.mouse = new p5.Vector(mouseX, mouseY);
    this.mouse.sub(this.pos);
    this.mouse.setMag(0.3);
    this.mouse.add(this.accc);
    this.acc = this.mouse;
    //this.nosx=map(noise(this.inc),0,1,-0.5,0.5);
    //this.nosy=map(noise(this.incc),0,1,-0.5,0.5);
    //this.acc=new p5.Vector(noise(3),noise(-1));
    this.accc = new p5.Vector(random(-1, 1), random(-0.1, 0.1));

    //this.acc = p5.Vector.random2D();
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.vel.limit(3);

    if (this.pos.y > height) {
      this.pos.y = 0;
    }
    if (this.pos.y < 0) {
      this.pos.y = height;
    }
    if (this.pos.x > width) {
      this.pos.x = 0;
    }
    if (this.pos.x < 0) {
      this.pos.x = width;
    }
    this.inc += 0.05;
    //this.incc+=0.5;
  };

  this.display = function () {
    //fill(230, 1);
    noFill();
    strokeWeight(setting.strokeWeight + frameCount * 0.0005);
    // strokeWeight(setting.strokeWeight);
    this.ss = map(sin(this.inc), -1, 1, 10, 100);
    this.ssmap = map(this.ss, 1, 100, 0, 255);
    stroke(this.ssmap);
    ellipse(this.pos.x, this.pos.y, this.ss, this.ss);
  };
}

function line1() {
  gain2 = new Tone.Gain(0.05).toDestination();
  delay = new Tone.Delay(0.7).connect(gain2);
  track1 = new Track(
    -14,
    /*noteDuration*/ "8n",
    /*tempo*/ "8n",
    "randomWalk",
    "fatsawtooth",
    delay
  );
}

function picShow() {
  if (
    mouseX < width / 2 - img1.width / 2 &&
    mouseY < height / 2 - img1.height / 2
  ) {
    image(img1, width / 2, height / 2);

    //Sound Line 02
    //     gain2 = new Tone.Gain(0.05).toDestination();
    //   delay = new Tone.Delay(0.7).connect(gain2);
    //   track1 = new Track(
    //     -14,
    //     /*noteDuration*/ "8n",
    //     /*tempo*/ "8n",
    //     "randomWalk",
    //     "fatsawtooth",
    //     delay
    //   );
    // }else{
    //   gain2.disconnect(Tone.Master)
  }

  if (
    mouseX > width / 2 + img1.width / 2 &&
    mouseY < height / 2 - img1.height / 2
  ) {
    image(img2, width / 2, height / 2);
  }
  if (
    mouseX > width / 2 + img3.width / 2 &&
    mouseY > height / 2 - img3.height / 2
  ) {
    image(img3, width / 2, height / 2);
  }
  if (
    mouseX < width / 2 - img4.width / 2 &&
    mouseY > height / 2 - img4.height / 2
  ) {
    image(img4, width / 2, height / 2);
  }
}
