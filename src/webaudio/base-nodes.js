var BaseNode = function(ctx, input, output) {
  var node = {
    input:  input,
    output: output,
    ctx: ctx,
    connect: function(other) {
      this.output.connect(other.input);
      return other;
    },
    disconnect: function() {
      this.output.disconnect();
      return this;
    }
  };
  return node;
};

var Node = function(ctx, effects, on) {
  var node = new BaseNode(ctx, ctx.createGain(), ctx.createGain());

  for(var i = 0; i < effects.length - 1; i++) {
    effects[i].connect(effects[i + 1])
  }
  effects[effects.length - 1].connect(node.output);

  node.toggleSwitch = function(on) {
    node.input.disconnect();
    if (on) {
      node.input.connect(effects[0]);
    } else {
      node.input.connect(node.output);
    }
    node.on = on
  }

  node.toggleSwitch(on || false);
  return node;
};

var Output = function(ctx, options) {
  var node = new BaseNode(ctx, ctx.destination);
  return node;
};

var Input = function(ctx, stream) {
  var node = new BaseNode(ctx, null, ctx.createMediaStreamSource(stream));
  return node;
};

var Knob = function(label, options, initial, fn) {
  var defaults = { min: 0, max: 10 }
  options = Object.assign(defaults, options)

  var map = function(x) {
    return x * ((options.max - options.min) / 10) + options.min
  };

  var knob = {
    set: function(value) {
      this.value = Math.min(Math.max(value, 0), 10);
      var y = map(this.value);
      fn(y);
    },
    label: label
  };
  knob.set(initial);

  return knob;
};

var Distortion = function(ctx, options, curveFn) {
  var distortion = ctx.createWaveShaper();
  distortion.oversample = '2x';

  var lowPass = ctx.createBiquadFilter();
  lowPass.type = 'lowpass';

  var level = ctx.createGain();

  var node = new Node(ctx, [distortion, lowPass, level], options.on);

  var curve = function(level) {
    var n_samples = 4096,
    curve = new Float32Array(n_samples),
    deg = Math.PI / 180,
    x;
    for (var i = 0; i < n_samples; ++i) {
      x = i * 2 / n_samples - 1;
      curve[i] = curveFn(x, level);
    }
    return curve;
  };

  node.knobs = [
    new Knob("drive", { min: 1, max: 10 }, options.drive || 5, function(x) {
      distortion.curve = curve(x);
    }),
    new Knob("tone", { min: 100, max: 22050 }, options.tone || 5, function(x) {
      lowPass.frequency.value = x;
    }),
    new Knob("level", { min: 0, max: 2 }, options.level || 5, function(x) {
      level.gain.value = x;
    })
  ];

  return node;
};

var Convolver = function(ctx, impulseResponseURL) {
  var conv = ctx.createConvolver();
  var request = new XMLHttpRequest();

  request.open('GET', impulseResponseURL, true);
  request.responseType = 'arraybuffer';

  request.onload = function() {
    ctx.decodeAudioData(request.response, function(buffer) {
      conv.buffer = buffer;
    });
  };
  request.send();
  return conv;
};

module.exports = {
  BaseNode: BaseNode,
  Node: Node,
  Input: Input,
  Output: Output,
  Knob: Knob,
  Distortion: Distortion,
  Convolver: Convolver
};
