
const assert = require('assert')
const isHex0x = require('./is-hex0x')
const hex0xToBuffer = require('./hex0x-to-buffer')

function hex0xToChar(value) {
  assert(isHex0x(value))
  const buf = hex0xToBuffer(value)
  assert(buf.length === 1, `Expected buffer length 1, got ${buf.length}.`)
  return String.fromCharCode(buf[0])
}

module.exports = hex0xToChar
