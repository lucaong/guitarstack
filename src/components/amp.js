var React = require('react');
var Draggable = require("./draggable");
var Knob = require('./knob');

module.exports = React.createClass({
  mixins: [Draggable],
  htmlClass: function() {
    return this.props.model.name.replace(/\W+/, '-').toLowerCase()
  },
  render: function() {
    var knobs = this.props.model.knobs.map(function(knob) {
          return <Knob knob={ knob } key={ knob.label } initialValue={ this.props.initialValues[knob.label] } />;
        }.bind(this));

    return (
      <div className={ "amp " + this.htmlClass() } draggable="true"
           onDragStart={ this.dragStart } onDragOver={ this.dragOver } onDrop={ this.drop }>
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
    );
  }
});
