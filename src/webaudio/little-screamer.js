const base = require("./base-nodes")

const LittleScreamer = function(ctx, options) {
  options = Object.assign({}, LittleScreamer.defaults, options)

  const volume = ctx.createGain()

  const bass = ctx.createBiquadFilter()
  bass.type = 'lowshelf'
  bass.frequency.value = 200

  const mid = ctx.createBiquadFilter()
  mid.type = 'peaking'
  mid.frequency.value = 1500

  const treble = ctx.createBiquadFilter()
  treble.type = 'highshelf'
  treble.frequency.value = 3000

  const conv = new base.Convolver(ctx, './impulses/little_screamer.ogg')

  const reverbGain    = ctx.createGain()
  const reverbConv    = new base.Convolver(ctx, './impulses/reverb.ogg')
  const reverbLevel   = ctx.createGain()
  const reverbOutGain = ctx.createGain()
  reverbGain.connect(reverbOutGain)

  const node = new base.Node(ctx,
    [conv, bass, mid, treble, volume, reverbGain, reverbConv, reverbLevel, reverbOutGain],
    true)

  node.name = "Little Screamer"
  node.type = "Amp"
  node.initialValues = options

  node.knobs = [
    new base.Knob("volume", { min: 0, max: 10 }, options.volume, (v) => {
      volume.gain.value = v
    }),
    new base.Knob("bass", { min: -30, max: 20 }, options.bass, (b) => {
      bass.gain.value = b
    }),
    new base.Knob("mid", { min: -40, max: 10 }, options.mid, (m) => {
      mid.gain.value = m
    }),
    new base.Knob("treble", { min: -40, max: 10 }, options.treble, (t) => {
      treble.gain.value = t
    }),
    new base.Knob("reverb", { min: 0, max: 1 }, options.reverb, (r) => {
      reverbLevel.gain.value = r
    })
  ]

  return node
}

LittleScreamer.defaults = { bass: 8, mid: 4, treble: 7, volume: 5, reverb: 7 }

module.exports = LittleScreamer
