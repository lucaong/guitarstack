const base = require("./base-nodes")

const DreamBox = function(ctx, options) {
  options = Object.assign({}, DreamBox.defaults, options)

  const preGain = ctx.createGain()
  const postGain = ctx.createGain()
  const delay1 = ctx.createDelay()
  const delay2 = ctx.createDelay()
  const depth = ctx.createGain()
  const level = ctx.createGain()

  const lfo1 = ctx.createOscillator()
  lfo1.frequency.value = 0.5
  lfo1.start()

  const lfo2 = ctx.createOscillator()
  lfo2.frequency.value = 0.5
  lfo2.start()

  const node = new base.Node(ctx, [preGain, delay1, delay2, postGain, level], options.on)

  postGain.gain.value = 0.5
  depth.gain.value = 0.002

  delay1.delayTime.value = 0.0005
  lfo1.connect(depth)
  depth.connect(delay1.delayTime)

  delay2.delayTime.value = 0.001
  lfo2.connect(depth)
  depth.connect(delay2.delayTime)

  preGain.connect(level)

  node.name = "Dream Box"
  node.type = "Chorus / Flanger"
  node.initialValues = options

  node.knobs = [
    new base.Knob("speed", { min: 0.1, max: 3 }, options.speed, (x) => {
      lfo1.frequency.value = x
      lfo2.frequency.value = x
    }),
    new base.Knob("depth", { min: 0.00005, max: 0.0005 }, options.depth, (x) => {
      depth.gain.value = x
    }),
    new base.Knob("mix", { min: 0, max: 1 }, options.mix, (x) => {
      postGain.gain.value = x
    })
  ]

  return node
}

DreamBox.defaults = { speed: 5, depth: 5, mix: 5 }

module.exports = DreamBox


