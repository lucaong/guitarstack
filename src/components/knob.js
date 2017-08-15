const React = require('react')
const createReactClass = require('create-react-class')

const Knob = createReactClass({
  getInitialState: function() {
    const angle = ((this.props.initialValue / 10) * (135 * 2)) - 135
    return { angle: angle || 0 }
  },
  turnKnob: function(event) {
    event.preventDefault()
    let angle = this.state.angle

    angle = angle + event.deltaY
    if (Math.abs(angle) <= 135) {
      this.setState({ angle: angle }, () => {
        const value = 10 * (angle + 135) / (135 * 2)
        this.props.knob.set(value)
      })
    }
  },
  render: function() {
    return (
      <div className="knob-wrap">
        <div className="knob">
          <div
            className="knob-dial"
            style={{ transform: "rotate(" + this.state.angle + "deg)" }}
            onWheel={ this.turnKnob } />
        </div>
        { this.props.knob.label }
      </div>
    )
  }
})

module.exports = Knob
