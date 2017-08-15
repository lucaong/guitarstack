require('babel-register')({ presets: ['react'] })

var chai = require('chai')
var enzyme = require('enzyme')
var sinon = require('sinon')
var sinonChai = require('sinon-chai')

chai.use(sinonChai)

global.expect = chai.expect
global.shallow = enzyme.shallow
global.render = enzyme.render
global.sinon = sinon
