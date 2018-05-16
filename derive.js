
const secp256k1 = require('secp256k1')
const toChecksumAddress = require('./to-checksum-address')
const keccak256 = require('./keccak256')
const makePrivateKey = require('./make-private-key')

function derive(maybePrivateKey) {

  const privateKey = maybePrivateKey || makePrivateKey()

  if (!secp256k1.privateKeyVerify(privateKey)) {
    throw new TypeError('Invalid private key.')
  }

  const publicKeyBuffer = secp256k1.publicKeyCreate(privateKey, false).slice(1)
  const address = toChecksumAddress(keccak256(publicKeyBuffer).slice(-20))
  const publicKey = '0x' + publicKeyBuffer.toString('hex')

  // Private key was provided, don't include it in the result.
  if (maybePrivateKey) {
    return { publicKey, address }
  }

  // Private key was not provided, include it in result.
  return { privateKey: '0x' + privateKey.toString('hex'), publicKey, address }
}

module.exports = derive
