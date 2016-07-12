var React = require('react');

module.exports = React.createClass({
  getInitialState: function() {
    return { angle: 0 };
  },
  turnKnob: function(event) {
    event.preventDefault();
    var angle = this.state.angle;

    angle = angle + event.deltaY;
    if (Math.abs(angle) <= 135) {
      this.setState({ angle: angle });
    }
  },
  render: function() {
    return (
      <div className="knob-wrap">
        <div className="knob">
          <div className="knob-dial"
            onWheel={this.turnKnob}
            style={{ transform: "rotate(" + this.state.angle + "deg)" }} />
        </div>
        {this.props.knob.label}
      </div>
    );
  }
});
