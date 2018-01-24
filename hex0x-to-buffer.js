
const assert = require('assert')
const isHex0x = require('./is-hex0x')

/**
 * Converts hex0x to buffer.
 *
 * @param {hex0x} value
 * @return {buffer}
 */
function hex0xToBuffer(value) {
  assert(isHex0x(value))
  return Buffer.from(value.slice(2), 'hex')
}

module.exports = hex0xToBuffer
