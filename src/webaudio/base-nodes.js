const BaseNode = function(ctx, input, output) {
  const node = {
    input:  input,
    output: output,
    ctx: ctx,
    connect: function(other) {
      this.output.connect(other.input)
      return other
    },
    disconnect: function() {
      this.output.disconnect()
      return this
    }
  }
  return node
}

const Node = function(ctx, effects, on) {
  const node = new BaseNode(ctx, ctx.createGain(), ctx.createGain())

  for(let i = 0; i < effects.length - 1; i++) {
    effects[i].connect(effects[i + 1])
  }
  effects[effects.length - 1].connect(node.output)

  node.effects = effects

  node.toggleSwitch = function(on) {
    node.input.disconnect()
    if (on) {
      node.input.connect(effects[0])
    } else {
      node.input.connect(node.output)
    }
    node.on = on
    if (node.onToggleSwitch) {
      node.onToggleSwitch(on)
    }
  }

  node.toggleSwitch(on || false)
  return node
}

const Output = function(ctx, options) {
  const node = new BaseNode(ctx, ctx.destination)
  return node
}

const Input = function(ctx, stream) {
  const node = new BaseNode(ctx, null, ctx.createMediaStreamSource(stream))
  return node
}

const Knob = function(label, options, initial, fn) {
  const defaults = { min: 0, max: 10 }
  options = Object.assign(defaults, options)

  const map = function(x) {
    return x * ((options.max - options.min) / 10) + options.min
  }

  const knob = {
    set: function(value) {
      this.value = Math.min(Math.max(value, 0), 10)
      const y = map(this.value)
      fn(y)
    },
    label: label
  }
  knob.set(initial)

  return knob
}

const Distortion = function(ctx, options, curveFn) {
  const distortion = ctx.createWaveShaper()
  distortion.oversample = '4x'

  const lowPass = ctx.createBiquadFilter()
  lowPass.type = 'lowpass'

  const highPass = ctx.createBiquadFilter()
  highPass.type = 'highpass'
  highPass.frequency.value = 280

  const level = ctx.createGain()

  const node = new Node(ctx, [highPass, distortion, lowPass, level], options.on)

  const curve = function(level) {
    const n = 4096 * 2
    const curve = new Float32Array(n + 1)
    const deg = Math.PI / 180
    let x

    for (let i = 0; i <= n; i++) {
      x = i * 2 / n - 1
      curve[i] = curveFn(x, level)
    }
    return curve
  }

  node.knobs = [
    new Knob("drive", { min: 1, max: 10 }, options.drive || 5, x => {
      distortion.curve = curve(x)
    }),
    new Knob("tone", { min: 200, max: 22050 }, options.tone || 5, x => {
      lowPass.frequency.value = x
    }),
    new Knob("level", { min: 0, max: 2 }, options.level || 5, x => {
      level.gain.value = x
    })
  ]

  return node
}

const Convolver = function(ctx, impulseResponseURL) {
  const conv = ctx.createConvolver()
  const request = new XMLHttpRequest()

  request.open('GET', impulseResponseURL, true)
  request.responseType = 'arraybuffer'

  request.onload = function() {
    ctx.decodeAudioData(request.response, function(buffer) {
      conv.buffer = buffer
    })
  }
  request.send()
  return conv
}

module.exports = {
  BaseNode: BaseNode,
  Node: Node,
  Input: Input,
  Output: Output,
  Knob: Knob,
  Distortion: Distortion,
  Convolver: Convolver
}
