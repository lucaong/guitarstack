const base = require("./base-nodes")

const BouncingBastard = function(ctx, options) {
  options = Object.assign({}, BouncingBastard.defaults, options)

  const level    = ctx.createGain()
  const delay    = ctx.createDelay()
  const feedback = ctx.createGain()
  const node     = new base.Node(ctx, [level, delay, feedback], options.on)

  node.name = "Bouncing Boulder"
  node.type = "Delay"
  node.initialValues = options

  level.connect(node.output)
  feedback.connect(delay)

  node.knobs = [
    new base.Knob("time", {min: 0, max: 1}, options.time, (x) => {
      delay.delayTime.value = x
    }),
    new base.Knob("feedback", {min: 0, max: 1}, options.feedback, (x) => {
      feedback.gain.value = x
    }),
    new base.Knob("level", {min: 0, max: 1}, options.level, (x) => {
      level.gain.value = x
    })
  ]

  return node
}

BouncingBastard.defaults = {time: 0.5, feedback: 5, level: 10}

module.exports = BouncingBastard
