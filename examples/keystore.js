
// const seedPrivateKeys = require('../seed-private-keys')
// const seedGanacheAccounts = require('../seed-ganache-accounts')
const { join } = require('path')
const seedKeystoreAccounts = require('../seed-keystore-accounts')
const puts = require('../puts')

const accounts = seedKeystoreAccounts(1000, { dir: join(__dirname, 'keystore'), c: 1 })
puts('%s', JSON.stringify(accounts.map(_1 => _1.address), null, 2))

// for (const { address } of seedGanacheAccounts(1000)) {
//   puts('"%s": { "balance": "00000000000000000000000000000000ffffffffffffffffffffffffffffffff" },', address)
// }
// puts('%s', JSON.stringify(r, null, 2))
// "0xDf35343AA0944CD6ff8CA15Ee3eb689F525CC36a": { "balance": "1606938044258990275541962092341162602522202993782792835301376" }
