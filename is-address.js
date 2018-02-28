
const isHex0x = require('./is-hex0x')

/**
 * Checks if provided `value` is an ethereum address (hex0x encoded).
 *
 * For strict checks @see `isChecksumAddress`.
 *
 * @param {any} value
 * @return {boolean}
 */
function isAddress(value) {
  return isHex0x(value) && value.length === 2 + 20 * 2
}

module.exports = isAddress
