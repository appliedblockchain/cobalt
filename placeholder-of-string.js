// @flow

const { inspect } = require('util')
const keccak256 = require('./keccak256')
const isString = require('lodash/isString')

function placeholderOfString(value /*: string */) /*: string */ {
  if (!isString(value)) {
    throw new TypeError(`Expected string, got ${inspect(value)}.`)
  }
  return `__$${keccak256(value).toString('hex').slice(0, 34)}$__`
}

module.exports = placeholderOfString
