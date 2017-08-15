const React = require('react')
const createReactClass = require('create-react-class')
const Draggable = require("./draggable")
const Knob = require('./knob')

const Amp = createReactClass({
  mixins: [Draggable],
  htmlClass: function() {
    return this.props.model.name.replace(/\W+/, '-').toLowerCase()
  },
  render: function() {
    const knobs = this.props.model.knobs.map(knob =>
      <Knob knob={ knob }
            key={ knob.label }
            initialValue={ this.props.initialValues[knob.label] } />
    )

    return (
      <div className={ "amp " + this.htmlClass() }
           draggable="true"
           onDragStart={ this.dragStart }
           onDragOver={ this.dragOver }
           onDrop={ this.drop }>
        <div className="amp-plate">
          <div className="knobs">
            { knobs }
          </div>
        </div>
        <div className="amp-speaker">
          <div className="amp-logo">
            { this.props.model.name }
            <small>{ this.props.model.type }</small>
          </div>
        </div>
      </div>
    )
  }
})

module.exports = Amp
