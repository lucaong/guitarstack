var React = require('react');
var StompBox = require('./stomp-box')
var Amp = require('./amp')

module.exports = React.createClass({
  render: function() {
    var gadgets = this.props.gadgets.map(function(gadget) {
      if (gadget.type == 'Amp') {
        return (<Amp model={ gadget } key={ gadget.name } initialValues={ gadget.initialValues } />);
      } else {
        return (<StompBox effect={ gadget } key={ gadget.name } initialValues={ gadget.initialValues } />);
      }
    }.bind(this));

    return (
      <div className="board">
        { gadgets }
      </div>
    );
  }
});
