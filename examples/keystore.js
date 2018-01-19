
const seedKeystoreAccounts = require('../seed-keystore-accounts')
const puts = require('../puts')

const accounts = seedKeystoreAccounts(1000, { dir: `${__dirname}/keystore`})
puts('%s', JSON.stringify(accounts.map(_1 => _1.address), null, 2))
