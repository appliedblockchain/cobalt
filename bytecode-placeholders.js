// @flow

const assert = require('assert')
const isString = require('lodash/isString')

/** @returns placeholders in bytecode. */
function bytecodePlaceholders(value /*: string */) /*: { [placeholder: string]: {| index: number |}[] } */ {
  assert(isString(value) && value.startsWith('0x'), 'Expected hex0x-like bytecode (string starging with 0x).')
  const re = /__.{36}__/g
  const placeholders = {}
  let match
  while ((match = re.exec(value))) {
    const [ placeholder ] = match
    const { index } = match
    if (!placeholders[placeholder]) {
      placeholders[placeholder] = []
    }
    placeholders[placeholder].push({ index })
  }
  return placeholders
}

module.exports = bytecodePlaceholders
