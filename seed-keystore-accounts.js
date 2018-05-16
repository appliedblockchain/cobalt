
const { join } = require('path')
const fs = require('fs')
const isDir = require('./is-dir-sync')
const keythereum = require('keythereum')
const seedPrivateKeys = require('./seed-private-keys')
const toChecksumAddress = require('./to-checksum-address')
const crypto = require('crypto')

const DEFAULT_PASSWORD = 'foo'

function makeKeystoreAccount(privateKey, { password = DEFAULT_PASSWORD, c = null } = {}) {
  const salt = crypto.randomBytes(32)
  const iv = crypto.randomBytes(16)

  // Allow custom number of iterations, ie. 1 for testing.
  const options = c ? {
    kdf: 'pbkdf2',
    cipher: 'aes-128-ctr',
    kdfparams: {
      c,
      dklen: 32,
      prf: 'hmac-sha256'
    }
  } : null

  const account = keythereum.dump(password, privateKey, salt, iv, options)
  account.address = toChecksumAddress('0x' + account.address).slice(2)
  return account
}

function seedKeystoreAccounts(n, { seed, dir, c } = {}) {
  const accounts = seedPrivateKeys(n, seed).map(_1 => makeKeystoreAccount(_1, { c }))

  // Save to files if `dir` was provided.
  if (isDir(dir)) {
    accounts.forEach(_1 => fs.writeFileSync(join(dir, `${_1.address}.json`), JSON.stringify(_1, null, 2) + '\n'))
  }

  return accounts
}

module.exports = seedKeystoreAccounts
