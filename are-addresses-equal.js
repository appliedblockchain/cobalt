
const toChecksumAddress = require('./to-checksum-address')

/**
 * Checks if two addresses are equal (checksummed, lower-case, upper-case and mixed-case).
 *
 * @param {hex0x} value
 * @param {hex0x} otherValue
 * @return {boolean}
 */
function areAddressesEqual(value, otherValue) {
  const address = toChecksumAddress(value)
  const otherAddress = toChecksumAddress(otherValue)
  return address === otherAddress
}

module.exports = areAddressesEqual
