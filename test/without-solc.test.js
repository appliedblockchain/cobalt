// @flow

const { join } = require('path')

const { web3, accounts } = require('../web3')({
  root: join(__dirname, '..', 'contracts')
})

const from = accounts[0].address
const gas = 50000000
let helloWorld

test('should require', () => {
  web3.require('HelloWorld.json')
})

test('should deploy', async () => {
  helloWorld = await web3.deploy('HelloWorld', [], { from, gas })
})

test('should be able to call', async () => {
  expect(await helloWorld.methods.helloWorld().call()).toEqual('Hello world!')
})
