const fs = require('fs')
const isDir = require('./is-dir-sync')
const keythereum = require('keythereum')
const seedPrivateKeys = require('./seed-private-keys')
const toChecksumAddress = require('./to-checksum-address')
const crypto = require('crypto')

const DEFAULT_PASSWORD = 'foo'

function makeKeystoreAccount(privateKey, { password = DEFAULT_PASSWORD } = {}) {
  const salt = crypto.randomBytes(32)
  const iv = crypto.randomBytes(16)
  const account = keythereum.dump(password, privateKey, salt, iv)
  account.address = toChecksumAddress('0x' + account.address).slice(2)
  return account
}

function seedKeystoreAccounts(n, { seed, dir } = {}) {
  const accounts = seedPrivateKeys(n, seed).map(makeKeystoreAccount)

  // Save to files if `dir` was provided.
  if (isDir(dir)) {
    accounts.forEach(_1 => fs.writeFileSync(`${dir}/${_1.address}.json`, JSON.stringify(_1, null, 2) + '\n'))
  }

  return accounts
}

module.exports = seedKeystoreAccounts
