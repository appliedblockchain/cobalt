const isAddress = require('./is-address')
const toChecksumAddress = require('./to-checksum-address')

/**
 * Checks if provided `value` is checksummed ethereum address.
 *
 * For strict checks @see `isChecksumAddress`.
 *
 * @param {any} value
 * @return {boolean}
 */
function isChecksumAddress(value) {
  return isAddress(value) && toChecksumAddress(value) === value
}

module.exports = isChecksumAddress
