
const keccak256 = require('./keccak256')

/**
 * Generates `n` private keys based on (optional) provided `seed`.
 *
 * @param {number} n
 * @param {buffer} seed?
 * @return {buffer[]} A list of private keys.
 */
function seedPrivateKeys(n, seed = Buffer.alloc(32, 0)) {
  let current = seed
  const next = () => current = keccak256(current)
  return Array.from(Array(n), next)
}

module.exports = seedPrivateKeys
