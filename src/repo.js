module.exports = {
  store: function(key, value, callback) {
    var json = JSON.stringify(value);
    localStorage.setItem(key, json);
    if (callback) {
      callback(value);
    }
  },
  load: function(key, callback) {
    var json = localStorage.getItem(key);
    var value = JSON.parse(json);
    callback(value);
  }
};
