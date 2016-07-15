var base = require("./base-nodes");

var BouncingBastard = function(ctx, options) {
  options = Object.assign({}, options, BouncingBastard.defaults);

  var level    = ctx.createGain();
  var delay    = ctx.createDelay();
  var feedback = ctx.createGain();
  var node     = new base.Node(ctx, [level, delay, feedback]);

  node.name = "Bouncing Bastard";
  node.type = "Delay";

  level.connect(node.output);
  feedback.connect(delay);

  node.knobs = [
    new base.Knob("time", { min: 0, max: 1 }, options.time, function(x) {
      delay.delayTime.value = x;
    }),
    new base.Knob("feedback", { min: 0, max: 1 }, options.feedback, function(x) {
      feedback.gain.value = x;
    }),
    new base.Knob("level", { min: 0, max: 1 }, options.level, function(x) {
      level.gain.value = x;
    })
  ];

  return node;
};

BouncingBastard.defaults = { time: 0.5, feedback: 5, level: 10 };

module.exports = BouncingBastard;
