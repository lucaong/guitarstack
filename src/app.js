var ReactDOM = require('react-dom');
var React = require('react');

var Board = require('./components/board');
var Effects = require('./effects')
var Amps = require('./amps')

var ctx = new AudioContext();

var gadgets = [
  new Effects["wave-squeezer"](ctx, { threshold: 3, attack: 2, level: 8 }),
  new Effects["blues-punch"](ctx, { drive: 3, tone: 7, level: 5 }),
  new Effects["glowing-sunshine"](ctx, { drive: 7, tone: 7, level: 5 }),
  new Effects["bouncing-bastard"](ctx, { time: 2, feedback: 3, level: 5 }),
  new Amps["little-screamer"](ctx, { volume: 8, bass: 7, mid: 4, treble: 5, reverb: 8 })
];

ReactDOM.render(
  <Board gadgets={ gadgets } />,
  document.getElementById('app')
);
