var React = require('react')
var Knob = require('../../src/components/knob.js')

describe('Knob', () => {
  it('sets the angle', () => {
    var knob = { label: 'foo', set: sinon.spy() }
    var component = shallow(<Knob initialValue={5} knob={knob} />)
    expect(component.find('.knob-dial').prop('style'))
      .to.have.property('transform', 'rotate(0deg)')

    var scrollEvent = { deltaY: 10, preventDefault: sinon.spy() }
    component.find('.knob-dial').simulate('wheel', scrollEvent)
    expect(component.find('.knob-dial').prop('style'))
      .to.have.property('transform', 'rotate(10deg)')
    expect(knob.set).to.have.been.calledWith(5.37037037037037)
    expect(scrollEvent.preventDefault).to.have.been.called
  })
})
