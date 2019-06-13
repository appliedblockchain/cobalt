// @flow

const { join } = require('path')

const { web3 } = require('../web3')({
  // provider: 'http://localhost:8545',
  root: join(__dirname, '..', 'contracts')
})

jest.setTimeout(10 * 1000)

const gas = 50000000
let from
let verifier

test('should setup', async () => {
  from = await web3.eth.getCoinbase()
})

test('should require', () => {
  web3.require('Verifier.sol')
})

test('should deploy', async () => {
  verifier = await web3.deploy('Verifier', [], { from, gas })
})

test('should validate', async () => {

  const A = [ '0x2e4a997ef48fbea7b028b7fed96b1c3a32a0f1bc93fa0deeef75fb7257addc48', '0x1143c47b28c640eeb70c102a211257facc1aecc36571f7b8b4e470f0470cba4d' ]
  const A_p = [ '0x2f5607fe02c4f1220ff6987176f528529098d4862487c676160e6bfcbefa1a96', '0x5af587fe5ef77666177618cbe03ea484e2eb2617f47717d4662f0cf72118922' ]
  const B = [ [ '0x1490dae180ec189f45a92d9ebff2ec6025c1eeed09f1279b326cfe69ccb0767e', '0x1df764c179e8dee76d577c10863506b68d4ec1c958eb3259c5e2b7ad1b019f5d' ], [ '0xb4d38e37e7391cf0b932c6c21ca56d77cd41d7c07ce07af2b9e80650bdee36a', '0x260ce914b14eb64838b578f68be374838317736dffa1b76186e224b9b1cc6e75' ] ]
  const B_p = [ '0x1d858e0663b31e1a493a90188d2aa60d78edf6a01ffe99beb5e6cfdb78f92ebb', '0x1ccb5c0c3f3f693905ad5a8452085ba578a2152f60ae87aeab163db1e378901f' ]
  const C = [ '0x9ced40daa1ac3e65ae9f42b96b9275372f63729f15f2e8061d30192ad613add', '0x25986db430212c1c7218e6adb3a1c8417d1219946572a279cf57b139bf2dc338' ]
  const C_p = [ '0x11faa42ff8e2878c09876c3f89231a225e7f1cdd36e4865fc43765fce191fa90', '0x2f9cc970a701177dd74016248daf4d095329646c7405d828a471b7455b9550cd' ]
  const H = [ '0x1122f2c662c39e24cb602bbd6f65adfed38b33184783e1ee6df2b41e2d88cc72', '0x12db64aec301e96e0d23571a46bc0720ec9cdd7979e8426c8d3897b6ed24a85c' ]
  const K = [ '0x231f7cd63f0c972c4fbc0e779e9e0cdae4db4cf5008cef3085d071a8387db49e', '0x1d67555359bb4515ee67238d381d6fa46aa3b167a844ced664c8664b19485c6e' ]

  expect(await verifier.methods.verifyTx(
    A, A_p, B, B_p, C, C_p, H, K, [ 1, 2, 3, 6 ]
  ).call({ from, gas })).toBe(true)

  expect(await verifier.methods.verifyTx(
    A, A_p, B, B_p, C, C_p, H, K, [ 2, 2, 3, 6 ]
  ).call({ from, gas })).toBe(false)
})
