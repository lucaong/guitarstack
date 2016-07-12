var ReactDOM = require('react-dom');
var React = require('react');

var Board = require('./components/board');
var Effects = require('./effects')
var Amps = require('./amps')

var gadgets = [
  Effects["wave-squeezer"],
  Effects["blues-punch"],
  Effects["glowing-sunshine"],
  Effects["bouncing-bastard"],
  Amps["little-screamer"]
];

ReactDOM.render(
  <Board gadgets={ gadgets } />,
  document.getElementById('app')
);
