const Base = require('../../src/webaudio/base-nodes.js')
const {BaseNode, Node, Input, Output, Knob, Distortion, Convolver} = Base

const mockAudioNode = function(props) {
  return Object.assign({
    connect: sinon.spy(),
    disconnect: sinon.spy()
  }, props)
}

const mockCtx = function() {
  return {
    createGain: sinon.spy(() =>
      mockAudioNode({ _type: 'Gain', gain: {} })),
    createMediaStreamSource: sinon.spy(() =>
      mockAudioNode({ _type: 'MediaStreamSource' })),
    createWaveShaper: sinon.spy(() =>
      mockAudioNode({ _type: 'WaveShaper' })),
    createBiquadFilter: sinon.spy(() =>
      mockAudioNode({ _type: 'BiquadFilter', frequency: {} })),
    destination: mockAudioNode()
  }
}

const mockBaseNode = function() {
  return {
    ctx: mockCtx(),
    input: mockAudioNode(),
    output: mockAudioNode(),
    connect: sinon.spy(x => x),
    disconnect: sinon.spy(function() { return this })
  }
}

describe('BaseNode', () => {
  let input
  let output
  let ctx
  let baseNode

  beforeEach(() => {
    input = mockAudioNode()
    output = mockAudioNode()
    ctx = mockCtx()
    baseNode = new BaseNode(ctx, input, output)
  })

  describe('constructor', () => {
    it('sets input, output and ctx', () => {
      expect(baseNode.input).to.eq(input)
      expect(baseNode.output).to.eq(output)
      expect(baseNode.ctx).to.eq(ctx)
    })
  })

  describe('connect', () => {
    it('connects output to other node\'s input and returns other', () => {
      const other = new Node(mockCtx(), [mockBaseNode()], true)
      const returned = baseNode.connect(other)
      expect(output.connect).to.have.been.calledWith(other.input)
      expect(returned).to.eq(other)
    })
  })

  describe('disconnect', () => {
    it('disconnects output and returns self', () => {
      const returned = baseNode.disconnect()
      expect(output.disconnect).to.have.been.called
      expect(returned).to.eq(baseNode)
    })
  })
})

describe('Node', () => {
  let node
  let effects

  beforeEach(() => {
    effects = [mockBaseNode(), mockBaseNode(), mockBaseNode()]
    node = new Node(mockCtx(), effects, true)
  })

  describe('constructor', () => {
    it('connects the effects chain', () => {
      expect(node.input.connect).to.have.been.calledWith(effects[0])
      expect(effects[0].connect).to.have.been.calledWith(effects[1])
      expect(effects[1].connect).to.have.been.calledWith(effects[2])
      expect(effects[2].connect).to.have.been.calledWith(node.output)
    })
  })

  describe('toggleSwitch', () => {
    it('connects/disconnects the effects and sets on property', () => {
      node.input.connect.reset()
      node.toggleSwitch(true)
      expect(node.input.connect).to.have.been.calledWith(effects[0])
      expect(node.on).to.be.true

      node.toggleSwitch(false)
      expect(node.input.connect).to.have.been.calledWith(node.output)
      expect(node.on).to.be.false
    })
  })
})

describe('Input', () => {
  describe('constructor', () => {
    it('returns a node wrapping a media stream source', () => {
      const ctx = mockCtx()
      const stream = 'test stream'
      const input = new Input(ctx, stream)
      expect(input.ctx).to.eq(ctx)
      expect(ctx.createMediaStreamSource).to.have.been.calledWith(stream)
    })
  })
})

describe('Output', () => {
  describe('constructor', () => {
    it('returns a node with the input set to the destination', () => {
      const ctx = mockCtx()
      const output = new Output(ctx)
      expect(output.ctx).to.eq(ctx)
      expect(output.input).to.eq(ctx.destination)
    })
  })
})

describe('Knob', () => {
  describe('constructor', () => {
    it('sets label and initial value', () => {
      const knob = new Knob('foo', { min: 0, max: 1 }, 4, () => {})
      expect(knob.label).to.eq('foo')
      expect(knob.value).to.eq(4)
    })
  })

  describe('set', () => {
    it('sets the value and calles the fn with the mapped value', () => {
      const fn = sinon.spy()
      const knob = new Knob('foo', { min: 1, max: 2 }, 4, fn)
      knob.set(2)
      expect(knob.value).to.eq(2)
      expect(fn).to.have.been.calledWith(1.2)
    })
  })
})

describe('Distortion', () => {
  describe('constructor', () => {
    it('wraps a wave shaper with tone and level', () => {
      const ctx = mockCtx()
      const dist = new Distortion(ctx, {}, () => {})
      expect(dist.effects[1]._type).to.eql('WaveShaper')
      expect(dist.effects[1].oversample).to.eql('4x')
      expect(dist.effects[2]._type).to.eql('BiquadFilter')
      expect(dist.effects[2].type).to.eql('lowpass')
      expect(dist.effects[3]._type).to.eql('Gain')
    })
  })

  describe('knobs', () => {
    it('drive sets the wave shaper curve', () => {
      const ctx = mockCtx()
      const curveFn = (x, k) => x * k
      const dist = new Distortion(ctx, {}, curveFn)
      const k = 10

      dist.knobs.find(k => k.label == 'drive').set(k)

      const curve = dist.effects.find(e => e._type == 'WaveShaper').curve

      expect(curve).to.be.a('float32array')
      expect(curve[0]).to.eq(-1 * k)
      expect(curve[curve.length - 1]).to.eq(1 * k)
    })

    it('tone sets the cutoff frequency of the filter', () => {
      const ctx = mockCtx()
      const dist = new Distortion(ctx, {}, () => 0)
      const filter = dist.effects[2]
      const knob = dist.knobs.find(k => k.label == 'tone')

      knob.set(1)
      const cutoff = filter.frequency.value
      knob.set(10)
      const newCutoff = filter.frequency.value

      expect(newCutoff).to.be.greaterThan(cutoff)
    })

    it('level sets the output gain', () => {
      const ctx = mockCtx()
      const dist = new Distortion(ctx, {}, () => 0)
      const level = dist.effects.find(e => e._type == 'Gain')
      const knob = dist.knobs.find(k => k.label == 'level')

      knob.set(1)
      const gain = level.gain.value
      knob.set(10)
      const newGain = level.gain.value

      expect(newGain).to.be.greaterThan(gain)
    })
  })
})
