const base = require("./base-nodes")

const TrembleOn = function(ctx, options) {
  options = Object.assign({}, TrembleOn.defaults, options)

  const gain = ctx.createGain()
  const depth = ctx.createGain()
  const level = ctx.createGain()

  const lfo = ctx.createOscillator()
  lfo.frequency.value = 0.7
  lfo.start()

  const node = new base.Node(ctx, [gain, level], options.on)

  lfo.connect(depth)
  depth.connect(gain.gain)

  node.name = "Tremble On"
  node.type = "Tremolo"
  node.initialValues = options

  node.knobs = [
    new base.Knob("speed", { min: 0.1, max: 10 }, options.speed, (x) => {
      lfo.frequency.value = x
    }),
    new base.Knob("depth", { min: 0, max: 1 }, options.depth, (x) => {
      depth.gain.value = x
    }),
    new base.Knob("level", { min: 0, max: 2 }, options.level, (x) => {
      level.gain.value = x
    })
  ]

  return node
}

TrembleOn.defaults = { speed: 5, depth: 5, level: 5 }

module.exports = TrembleOn

