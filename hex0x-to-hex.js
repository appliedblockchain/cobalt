
const assert = require('assert')
const isHex0x = require('./is-hex0x')

function hex0xToHex(value) {
  assert(isHex0x(value), 'Expected hex0x input.')
  return value.slice(2)
}

module.exports = hex0xToHex
