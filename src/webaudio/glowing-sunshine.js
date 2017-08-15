const base = require("./base-nodes")

const GlowingSunshine = function(ctx, options) {
  options = Object.assign({}, GlowingSunshine.defaults, options)

  const node = new base.Distortion(ctx, options, (x, level) => {
    return Math.tanh(level * x * Math.PI) * Math.cos(0.5 * x)
  })

  node.name = "Glowing Sunshine"
  node.type = "Distortion"
  node.initialValues = options

  return node
}

GlowingSunshine.defaults = { drive: 5, tone: 5, level: 5 }

module.exports = GlowingSunshine
