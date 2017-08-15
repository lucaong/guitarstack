const base = require("./base-nodes")

const WaveSqueezer = function(ctx, options) {
  options = Object.assign({}, WaveSqueezer.defaults, options)

  const level = ctx.createGain()
  const comp = ctx.createDynamicsCompressor()
  const node = new base.Node(ctx, [comp, level], options.on)

  node.name = "Wave Squeezer"
  node.type = "Compressor"
  node.initialValues = options

  comp.ratio.value = 2
  comp.knee.value = 5
  comp.release.value = 0.5

  node.knobs = [
    new base.Knob("threshold", { min: -100, max: 0 }, options.threshold, (x) => {
      comp.threshold.value = x
    }),
    new base.Knob("attack", { min: 0.001, max: 0.2 }, options.attack, (x) => {
      comp.attack.value = x
    }),
    new base.Knob("level", { min: 0, max: 10 }, options.level, (x) => {
      level.gain.value = x
    })
  ]

  return node
}

WaveSqueezer.defaults = { threshold: 8, attack: 2, level: 5 }

module.exports = WaveSqueezer
