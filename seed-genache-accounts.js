
const seedPrivateKeys = require('./seed-private-keys')
const makeGenacheAccount = require('./make-ganeche-account')

function seedGenacheAccounts(n, seed) {
  return seedPrivateKeys(n, seed).map(makeGenacheAccount)
}

module.exports = seedGenacheAccounts
