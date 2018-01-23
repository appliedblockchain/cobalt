
const seedPrivateKeys = require('./seed-private-keys')
const makeGanacheAccount = require('./make-ganache-account')

function seedGanacheAccounts(n, seed) {
  return seedPrivateKeys(n, seed).map(makeGanacheAccount)
}

module.exports = seedGanacheAccounts
