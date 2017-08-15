const React = require('react')
const Knob = require('../../src/components/knob.js')

describe('Knob', () => {
  it('sets the angle and the value on scroll wheel', () => {
    const knob = { label: 'foo', set: sinon.spy() }
    const component = shallow(<Knob initialValue={5} knob={knob} />)
    expect(component.find('.knob-dial').prop('style'))
      .to.have.property('transform', 'rotate(0deg)')

    const scrollEvent = { deltaY: 10, preventDefault: sinon.spy() }
    component.find('.knob-dial').simulate('wheel', scrollEvent)
    expect(component.find('.knob-dial').prop('style'))
      .to.have.property('transform', 'rotate(10deg)')
    expect(knob.set).to.have.been.calledWith(5.37037037037037)
    expect(scrollEvent.preventDefault).to.have.been.called
  })
})
