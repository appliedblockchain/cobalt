
const derive = require('./derive')

const DEFAULT_BALANCE = '00000000000000000000000000000000ffffffffffffffffffffffffffffffff'

function makeGenacheAccount(secretKey) {
  const { publicKey, address } = derive(secretKey)
  return { balance: DEFAULT_BALANCE, secretKey: '0x' + secretKey.toString('hex'), publicKey, address }
}

module.exports = makeGenacheAccount
