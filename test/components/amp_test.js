var React = require('react')
var Amp = require('../../src/components/amp.js')

describe('Amp', () => {
  var initialValues = {}
  var model

  beforeEach(function () {
    model = {
      name: 'Foo Bar',
      type: 'Xxx',
      knobs: [{ label: 'bar' }, { label: 'baz' }]
    }
  })

  it('has the right class name', () => {
    var amp = shallow(<Amp
      model={model}
      initialValues={initialValues} />)
    expect(amp.hasClass('foo-bar')).to.be.true
  })

  it('renders all the knobs', () => {
    var amp = shallow(<Amp
      model={model}
      initialValues={initialValues} />)
    expect(amp.find('Knob')).to.have.length(2)
    expect(amp.find('Knob').map(x => x.prop('knob')))
      .to.eql(model.knobs)
  })

  it('calls props.swapGadgets on drag/drop', () => {
    var swapGadgets = sinon.spy()
    var event = {
      dataTransfer: {
        setData: function(x) {
          this.types.push(x)
        },
        types: []
      },
      preventDefault: sinon.spy()
    }

    var ampOne = shallow(<Amp
      model={model}
      initialValues={initialValues}
      swapGadgets={swapGadgets}
      id="one" />)

    var ampTwo = shallow(<Amp
      model={model}
      initialValues={initialValues}
      swapGadgets={swapGadgets}
      id="two" />)

    ampOne.simulate('dragStart', event)
    ampTwo.simulate('dragOver', event)
    expect(event.preventDefault).to.have.been.called
    expect(swapGadgets).to.have.been.calledWith('two', 'one')
  })

  it('calls props.rewireEffects on drop', () => {
    var rewireEffects = sinon.spy()
    var amp = shallow(<Amp
      model={model}
      initialValues={initialValues}
      rewireEffects={rewireEffects}
      id="one" />)

    amp.simulate('drop')
    expect(rewireEffects).to.have.been.called
  })
})
