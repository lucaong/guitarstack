const React = require('react')
const StompBox = require('../../src/components/stomp-box.js')

describe('StompBox', () => {
  const initialValues = { on: false }
  let effect

  beforeEach(function () {
    effect = {
      name: 'Foo Bar',
      type: 'Xxx',
      toggleSwitch: sinon.spy(),
      knobs: [{ label: 'bar' }, { label: 'baz' }]
    }
  })

  it('has the right class name', () => {
    const stompBox = shallow(<StompBox
      effect={effect}
      initialValues={initialValues} />)
    expect(stompBox.hasClass('foo-bar')).to.be.true
  })

  it('turns the effect on/off on click', () => {
    const stompBox = shallow(<StompBox
      effect={effect}
      initialValues={initialValues} />)

    expect(stompBox.hasClass('off')).to.be.true
    expect(stompBox.hasClass('on')).to.be.false
    expect(effect.toggleSwitch).not.to.have.been.called

    stompBox.find('.stomp-switch').simulate('click')
    expect(stompBox.hasClass('off')).to.be.false
    expect(stompBox.hasClass('on')).to.be.true
    expect(effect.toggleSwitch).to.have.been.calledWith(true)

    stompBox.find('.stomp-switch').simulate('click')
    expect(stompBox.hasClass('off')).to.be.true
    expect(stompBox.hasClass('on')).to.be.false
    expect(effect.toggleSwitch).to.have.been.calledWith(false)
  })

  it('renders all the knobs', () => {
    const stompBox = shallow(<StompBox
      effect={effect}
      initialValues={initialValues} />)
    expect(stompBox.find('Knob')).to.have.length(2)
    expect(stompBox.find('Knob').map(x => x.prop('knob')))
      .to.eql(effect.knobs)
  })

  it('calls props.swapGadgets on drag/drop', () => {
    const swapGadgets = sinon.spy()
    const event = {
      dataTransfer: {
        setData: function(x) {
          this.types.push(x)
        },
        types: []
      },
      preventDefault: sinon.spy()
    }

    const boxOne = shallow(<StompBox
      effect={effect}
      initialValues={initialValues}
      swapGadgets={swapGadgets}
      id="one" />)

    const boxTwo = shallow(<StompBox
      effect={effect}
      initialValues={initialValues}
      swapGadgets={swapGadgets}
      id="two" />)

    boxOne.simulate('dragStart', event)
    boxTwo.simulate('dragOver', event)
    expect(event.preventDefault).to.have.been.called
    expect(swapGadgets).to.have.been.calledWith('two', 'one')
  })

  it('calls props.rewireEffects on drop', () => {
    const rewireEffects = sinon.spy()
    const box = shallow(<StompBox
      effect={effect}
      initialValues={initialValues}
      rewireEffects={rewireEffects}
      id="one" />)

    box.simulate('drop')
    expect(rewireEffects).to.have.been.called
  })
})
