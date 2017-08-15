const ReactDOM = require('react-dom')
const React = require('react')

const Board = require('./components/board')
const Gadgets = require('./gadgets')
const Repo = require("./repo")
const base = require("./webaudio/base-nodes")
const adapter = require("webrtc-adapter")

const defaultGadgetList = [
  {
    id: "1",
    name: "Wave Squeezer",
    settings: { threshold: 3, attack: 2, level: 8, on: true }
  },
  {
    id: "2",
    name: "Blues Punch",
    settings: { drive: 3, tone: 7, level: 5, on: false }
  },
  {
    id: "3",
    name: "Glowing Sunshine",
    settings: { drive: 7, tone: 7, level: 5, on: true }
  },
  {
    id: "4",
    name: "Bouncing Bastard",
    settings: { time: 2, feedback: 3, level: 5, on: false }
  },
  {
    id: "5",
    name: "Little Screamer",
    settings: { volume: 8, bass: 7, mid: 4, treble: 5, reverb: 8 }
  }
]

navigator.mediaDevices.getUserMedia({
  audio: {
    echoCancellation: false,
    googEchoCancellation: false,
    googAutoGainControl: false,
    googNoiseSuppression: false,
    googHighpassFilter: false,
    latency: 10
  }
})
  .catch(function(error) { alert(error) })
  .then(function(mediaStream) {
    const ctx = new AudioContext()
    const input = new base.Input(ctx, mediaStream)
    const output = new base.Output(ctx)

    Repo.load("preset-0:bank-0", function(gadgetList) {
      const gadgets = (gadgetList || defaultGadgetList).map(function(elem) {
        const gadget = new Gadgets[elem.name](ctx, elem.settings)
        gadget.id = elem.id
        return gadget
      })

      ReactDOM.render(
        <Board gadgets={ gadgets } input={ input } output={ output } repo={ Repo } />,
        document.getElementById('app')
      )
    })
  })
