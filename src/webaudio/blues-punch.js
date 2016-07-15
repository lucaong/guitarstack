var base = require("./base-nodes");

var BluesPunch = function(ctx, options) {
  options = Object.assign({}, options, BluesPunch.defaults);

  var node = new base.Distortion(ctx, options, function(x, level) {
    return (Math.PI + level * 15) * x * 57 * (Math.PI / 180) / (Math.PI + level * Math.abs(x));
  });

  node.name = "Blues Punch";
  node.type = "Overdrive";

  return node;
};

BluesPunch.defaults = { drive: 5, tone: 5, level: 5 };

module.exports = BluesPunch;
