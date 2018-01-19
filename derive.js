
const secp256k1 = require('secp256k1')
const toChecksumAddress = require('./to-checksum-address')
const keccak256 = require('./keccak256')

function derive(privateKey) {

  if (!secp256k1.privateKeyVerify(privateKey)) {
    throw new TypeError('Invalid private key.')
  }

  const publicKey = secp256k1.publicKeyCreate(privateKey, false).slice(1)

  const address = toChecksumAddress(keccak256(publicKey).slice(-20))

  return {
    publicKey: '0x' + publicKey.toString('hex'),
    address
  }
}

module.exports = derive
