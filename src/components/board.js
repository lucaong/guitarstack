var React = require('react');
var Effects = require('../effects')
var Amps = require('../amps')
var StompBox = require('./stomp-box')
var Amp = require('./amp')

module.exports = React.createClass({
  render: function() {
    return (
      <div className="board">
        <StompBox effect={ Effects["wave-squeezer"] } />
        <StompBox effect={ Effects["blues-punch"] } />
        <StompBox effect={ Effects["glowing-sunshine"] } />
        <StompBox effect={ Effects["bouncing-bastard"] } />
        <Amp model={ Amps["little-screamer"] } />
      </div>
    );
  }
});
