
const { isString } = require('lodash')

const HexRegExp = /^([0-9a-f]{2})+$/i

/**
 * Checks if `value` is hex string, returns `true` or `false`.
 *
 * @param {any} value
 * @return {boolean}
 */
function isHex(value) {
  return isString(value) && value.length > 0 && value.length % 2 === 0 && HexRegExp.test(value)
}

module.exports = isHex
