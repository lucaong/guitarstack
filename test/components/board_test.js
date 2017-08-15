const React = require('react')
const Board = require('../../src/components/board.js')

describe('Board', () => {
  const mockNode = function(fields) {
    return Object.assign({
      connect: sinon.spy(x => x),
      disconnect: sinon.spy(function() { return this }),
    }, fields)
  }
  const mockRepo = function() {
    return {
      store: sinon.spy(),
      load: sinon.spy()
    }
  }
  const gadgets = [
    mockNode({ id: 'foo', name: 'Foo', knobs: [], on: true }),
    mockNode({ id: 'bar', name: 'Bar', knobs: [], on: false }),
    mockNode({
      id: 'baz',
      name: 'Baz',
      knobs: [{ label: 'x', value: 5 }, { label: 'y', value: 5.5 }],
      on: true
    })
  ]
  const input = mockNode()
  const output = mockNode()
  let board

  beforeEach(() => {
    board = shallow(<Board
      gadgets={gadgets}
      input={input}
      output={output}
      repo={mockRepo()} />)
  })

  it('renders all gadgets in order', () => {
    const boxes = board.find('StompBox')
    expect(boxes).to.have.length(3)
    expect(boxes.map(b => b.prop('id'))).to.eql(['foo', 'bar', 'baz'])
  })

  it('passes callbacks to gadgets', () => {
    board.find('StompBox').forEach(box => {
      const instance = board.instance()
      expect(box.prop('swapGadgets')).to.eql(instance.swapGadgets)
      expect(box.prop('rewireEffects')).to.eql(instance.rewireEffects)
    })
  })

  describe('swapGadgets', () => {
    it('inserts the second gadget where the first is', () => {
      expect(board.state().gadgets.map(g => g.id))
        .to.eql(['foo', 'bar', 'baz'])
      board.instance().swapGadgets('foo', 'baz')
      expect(board.state().gadgets.map(g => g.id))
        .to.eql(['baz', 'foo', 'bar'])
      board.instance().swapGadgets('baz', 'foo')
      expect(board.state().gadgets.map(g => g.id))
        .to.eql(['foo', 'baz', 'bar'])
    })
  })

  describe('rewireEffects', () => {
    it('disconnects and re-connects effects', () => {
      board.instance().rewireEffects()
      gadgets.forEach(gadget => {
        expect(gadget.disconnect).to.have.been.calledOnce
        expect(gadget.connect).to.have.been.calledOnce
      })
    })
  })

  describe('save', () => {
    it('stores the serialized effects state in the repo', () => {
      board.find('button.save').simulate('click')
      expect(board.instance().props.repo.store)
        .to.have.been.calledWith('preset-0:bank-0', [
          { id: 'foo', name: 'Foo', settings: { on: true } },
          { id: 'bar', name: 'Bar', settings: { on: false } },
          { id: 'baz', name: 'Baz', settings: { on: true, x: 5, y: 5.5 } }
        ])
    })
  })
})
