var ReactDOM = require('react-dom');
var React = require('react');

var Board = require('./components/board');
var Effects = require('./effects')
var Amps = require('./amps')

var ctx = new AudioContext();

var gadgets = [
  Effects["wave-squeezer"](ctx, {}),
  Effects["blues-punch"](ctx, {}),
  Effects["glowing-sunshine"](ctx, {}),
  Effects["bouncing-bastard"](ctx, {}),
  Amps["little-screamer"](ctx, {})
];

ReactDOM.render(
  <Board gadgets={ gadgets } />,
  document.getElementById('app')
);
