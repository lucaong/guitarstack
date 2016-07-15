var base = require("./base-nodes");

var LittleScreamer = function(ctx, options) {
  options = Object.assign({}, LittleScreamer.defaults, options);

  var volume = ctx.createGain();

  var bass = ctx.createBiquadFilter();
  bass.type = 'lowshelf';
  bass.frequency.value = 80;

  var mid = ctx.createBiquadFilter();
  mid.type = 'peaking';
  mid.frequency.value = 1500;

  var treble = ctx.createBiquadFilter();
  treble.type = 'highshelf';
  treble.frequency.value = 3000;

  var conv   = new base.Convolver(ctx, '/impulses/little_screamer.wav');

  var reverbGain    = ctx.createGain()
  var reverbConv    = new base.Convolver(ctx, '/impulses/plate_reverb.wav');
  var reverbLevel   = ctx.createGain()
  var reverbOutGain = ctx.createGain()
  reverbGain.connect(reverbOutGain);

  var node   = new base.Node(ctx, [conv, bass, mid, treble, volume, reverbGain, reverbConv, reverbLevel, reverbOutGain]);

  node.name = "Little Screamer";
  node.type = "Amp";
  node.initialValues = options;

  node.knobs = [
    new base.Knob("volume", { min: 0, max: 5 }, options.volume, function(v) {
      volume.gain.value = v;
    }),
    new base.Knob("bass", { min: -40, max: 10 }, options.bass, function(b) {
      bass.gain.value = b;
    }),
    new base.Knob("mid", { min: -40, max: 10 }, options.mid, function(m) {
      mid.gain.value = m;
    }),
    new base.Knob("treble", { min: -40, max: 10 }, options.treble, function(t) {
      treble.gain.value = t;
    }),
    new base.Knob("reverb", { min: 0, max: 1 }, options.reverb, function(r) {
      reverbLevel.gain.value = r;
    })
  ];

  return node;
};

LittleScreamer.defaults = { bass: 8, mid: 4, treble: 7, volume: 5, reverb: 7 };

module.exports = LittleScreamer;
