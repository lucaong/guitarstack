const React = require("react")
const createReactClass = require('create-react-class')
const Draggable = require("./draggable")
const Knob = require("./knob")

const StompBox = createReactClass({
  mixins: [Draggable],
  getInitialState: function() {
    return { active: this.props.initialValues["on"] || false }
  },
  htmlClass: function() {
    const nameClass = this.props.effect.name
      .replace(/\W+/, "-").toLowerCase()
    const activeClass = this.state.active ? "on" : "off"
    return ["stomp-box", activeClass, nameClass].join(" ")
  },
  toggleSwitch: function() {
    this.setState({ active: !this.state.active }, () => {
      this.props.effect.toggleSwitch(this.state.active)
    })
  },
  render: function() {
    const effect = this.props.effect
    const knobs = this.props.effect.knobs.map(knob =>
      <Knob
        knob={ knob }
        key={ knob.label }
        initialValue={ this.props.initialValues[knob.label] } />
    )

    return (
      <div draggable="true" className={ this.htmlClass() }
        onDragStart={ this.dragStart } onDragOver={ this.dragOver }
        onDrop={ this.drop }>
        <div className="knobs">
          <div className="stomp-led"></div>
          { knobs }
        </div>
        <div className="stomp-switch" onClick={ this.toggleSwitch }>
          { effect.name }
          <small>{ effect.type }</small>
        </div>
      </div>
    )
  }
})

module.exports = StompBox
