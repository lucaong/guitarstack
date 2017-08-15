module.exports = {
  store: function(key, value, callback) {
    const json = JSON.stringify(value)
    localStorage.setItem(key, json)
    if (callback) {
      callback(value)
    }
  },
  load: function(key, callback) {
    const json = localStorage.getItem(key)
    const value = JSON.parse(json)
    callback(value)
  }
}
