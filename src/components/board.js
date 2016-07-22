var React = require('react');
var StompBox = require('./stomp-box');
var Amp = require('./amp');
var Repo = require('../repo');

module.exports = React.createClass({
  getInitialState: function() {
    return { gadgets: this.props.gadgets };
  },
  swapGadgets: function(idA, idB) {
    var gadgets = this.state.gadgets.slice(0);
    var idxB = gadgets.findIndex(function(gadget) { return gadget.id == idB });
    var b = gadgets.splice(idxB, 1);
    var idxA = gadgets.findIndex(function(gadget) { return gadget.id == idA });
    if (idxB <= idxA) {
      gadgets.splice(idxA + 1, 0, b[0]);
    } else {
      gadgets.splice(idxA, 0, b[0]);
    }
    this.setState({ gadgets: gadgets });
  },
  serialize: function() {
    return this.state.gadgets.map(function(gadget) {
      return {
        id: gadget.id,
        name: gadget.name,
        settings: gadget.knobs.reduce(function(s, knob) {
          s[knob.label] = knob.value;
          return s;
        }, {})
      }
    });
  },
  save: function() {
    Repo.store("preset-0:bank-0", this.serialize(), function(value) {
      console.log("saved", JSON.stringify(value));
    });
  },
  render: function() {
    return (
      <div className="board">
        <header className="header">
          <h1>GuitarStack<b>.io</b></h1>
          <div className="controls">
            <button onClick={ this.save }>Save</button>
          </div>
        </header>
        {
          this.state.gadgets.map(function(gadget) {
            if (gadget.type == 'Amp') {
              return (
                <Amp model={ gadget } key={ gadget.id } id={ gadget.id }
                initialValues={ gadget.initialValues } swapGadgets={ this.swapGadgets } />
              );
            } else {
              return (
                <StompBox effect={ gadget } key={ gadget.id } id={ gadget.id }
                initialValues={ gadget.initialValues } swapGadgets={ this.swapGadgets } />
              );
            }
          }.bind(this))
        }
      </div>
    );
  }
});
