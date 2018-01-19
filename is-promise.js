
const { isFunction } = require('lodash')
const { get } = require('lodash')

/**
 * Check if `value` is Promise/A+.
 *
 * @param {any} value
 * @return {boolean}
 */
function isPromise(value) {
  return isFunction(get(value, 'then'))
}

module.exports = isPromise
