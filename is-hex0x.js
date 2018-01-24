const { isString } = require('lodash')
const isHex = require('./is-hex')

/**
 * Checks if `value` is `hex0x` string; returns `true` or `false`.
 *
 * @param {any} value
 * @return {boolean}
 */
function isHex0x(value) {
  return isString(value) && value.startsWith('0x') && isHex(value.slice(2))
}

module.exports = isHex0x
