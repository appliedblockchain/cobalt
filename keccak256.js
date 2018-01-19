
const createKeccakHash = require('keccak')

function keccak256(value) {
  return createKeccakHash('keccak256').update(value).digest()
}

module.exports = keccak256
