
const derive = require('./derive')

const DEFAULT_BALANCE = '00000000000000000000000000000000ffffffffffffffffffffffffffffffff'

function makeGanacheAccount(secretKey) {
  const { publicKey, address } = derive(secretKey)
  return { balance: DEFAULT_BALANCE, secretKey: '0x' + secretKey.toString('hex'), publicKey, address }
}

module.exports = makeGanacheAccount
