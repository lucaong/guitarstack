require('babel-register')({ presets: ['react', 'es2015'] })

const chai = require('chai')
const enzyme = require('enzyme')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

chai.use(sinonChai)

global.expect = chai.expect
global.shallow = enzyme.shallow
global.render = enzyme.render
global.sinon = sinon
