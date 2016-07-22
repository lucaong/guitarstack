var React = require("react");
var Draggable = require("./draggable");
var Knob = require("./knob");

module.exports = React.createClass({
  mixins: [Draggable],
  getInitialState: function() {
    return { active: true };
  },
  htmlClass: function() {
    var nameClass = this.props.effect.name.replace(/\W+/, "-").toLowerCase();
    var activeClass = this.state.active ? "on" : "off";
    return ["stomp-box", activeClass, nameClass].join(" ");
  },
  toggleSwitch: function() {
    this.setState({ active: !this.state.active }, function() {
      this.props.effect.toggleSwitch(this.state.active)
    }.bind(this));
  },
  render: function() {
    var effect = this.props.effect;
    var knobs = this.props.effect.knobs.map(function(knob) {
          return <Knob knob={ knob } key={ knob.label } initialValue={ this.props.initialValues[knob.label] } />;
        }.bind(this));

    return (
      <div draggable="true" className={ this.htmlClass() } onDragStart={ this.dragStart }
           onDragOver={ this.dragOver }>
        <div className="knobs">
          <div className="stomp-led"></div>
          { knobs }
        </div>
        <div className="stomp-switch" onClick={ this.toggleSwitch }>
          { effect.name }
          <small>{ effect.type }</small>
        </div>
      </div>
    );
  }
});
