
const secp256k1 = require('secp256k1')

function isPrivateKey(value) {
  return secp256k1.privateKeyVerify(value)
}

module.exports = isPrivateKey
