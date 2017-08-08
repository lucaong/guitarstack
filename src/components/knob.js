var React = require('react');

module.exports = Knob = React.createClass({
  getInitialState: function() {
    var angle = ((this.props.initialValue / 10) * (135 * 2)) - 135;
    return { angle: angle || 0 };
  },
  turnKnob: function(event) {
    event.preventDefault();
    var angle = this.state.angle;

    angle = angle + event.deltaY;
    if (Math.abs(angle) <= 135) {
      this.setState({ angle: angle }, function() {
        var value = 10 * (angle + 135) / (135 * 2);
        this.props.knob.set(value);
      }.bind(this));
    }
  },
  render: function() {
    return (
      <div className="knob-wrap">
        <div className="knob">
          <div className="knob-dial"
            onWheel={ this.turnKnob }
            style={{ transform: "rotate(" + this.state.angle + "deg)" }} />
        </div>
        { this.props.knob.label }
      </div>
    );
  }
});
