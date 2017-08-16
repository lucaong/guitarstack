const base = require("./base-nodes")

const BluesPunch = function(ctx, options) {
  options = Object.assign({}, BluesPunch.defaults, options)

  const node = new base.Distortion(ctx, options, (x, level) => {
    return Math.tanh(0.5 * level * level * x * Math.PI)
  })

  node.name = "Blues Punch"
  node.type = "Overdrive"
  node.initialValues = options

  return node
}

BluesPunch.defaults = { drive: 5, tone: 5, level: 5 }

module.exports = BluesPunch
