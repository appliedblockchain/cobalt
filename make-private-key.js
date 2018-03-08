
const crypto = require('crypto')
const isPrivateKey = require('./is-private-key')

function makePrivateKey() {
  let privateKey
  do {
    privateKey = crypto.randomBytes(32)
  } while (!isPrivateKey(privateKey))
  return privateKey
}

module.exports = makePrivateKey
