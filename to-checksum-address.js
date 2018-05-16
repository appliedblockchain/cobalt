
const createKeccakHash = require('keccak')
const { isBuffer } = require('lodash')
const { isString } = require('lodash')

function toChecksumAddress(value) {

  if (isBuffer(value)) {
    if (value.length !== 20) {
      throw new TypeError(`Expected buffer size 20, got ${value.length}.`)
    }
    return toChecksumAddress('0x' + value.toString('hex'))
  }

  if (!isString(value)) {
    throw new TypeError(`Expected string, got ${typeof value}.`)
  }

  if (value.length !== 2 + (20 * 2)) {
    throw new TypeError(`Invalid input size ${value.length}, expected 2 + 20 * 2.`)
  }

  const hex = value.slice(2).toLowerCase()
  const hash = createKeccakHash('keccak256').update(hex).digest('hex')
  return '0x' + hex
    .split('')
    .map((c, i) => parseInt(hash[i], 16) >= 8 ? c.toUpperCase() : c)
    .join('')
}

module.exports = toChecksumAddress
