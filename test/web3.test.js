// @flow

process.on('warning', err => console.warn(err.stack))

const Web3 = require('../web3')
const { web3, accounts } = require('../web3')({ accounts: 10 })
const isChecksumAddress = require('../is-checksum-address')

const from = accounts[0].address
const gas = 50000000

test('should require, deploy and do at', async () => {
  web3.require('HelloWorld.sol')
  const helloWorld = await web3.deploy('HelloWorld', [], { from, gas })
  expect(isChecksumAddress(helloWorld.options.address)).toBe(true)
  const helloWorld2 = web3.at('HelloWorld', helloWorld.options.address)
  expect(await helloWorld2.methods.helloWorld().call()).toEqual('Hello world!')
})

// test('can autodetect the provider when passed a string', () => {
//   [
//     { provider: 'http://localhost:8545', name: 'HttpProvider' },
//     { provider: 'https://localhost:8545', name: 'HttpProvider' },
//     { provider: 'ws://localhost:8546', name: 'WebsocketProvider' },
//     { provider: 'wss://localhost:8546', name: 'WebsocketProvider' },
//     { provider: 'ipc://path', name: 'IpcProvider' }
//   ].forEach(({ provider, name }) => {
//     expect((new Web3(provider)).provider.constructor.name).toEqual(name)
//   })
// })

test('throws an error if the provider is invalid', () => {
  expect(() => {
    new Web3({ provider: 'wXs://myhost' })
  }).toThrow()
})

// it('should fail to require contract having ambiguous placeholder links', () => {
//   expect(() => web3.require('Ambiguous.sol')).to.throw('Ambiguous placeholders __LibraryNameThatOverflowsItsPlacehold__.')
// })

test('should require contract with placeholders', () => {
  expect(web3.require('WithLinks.sol')).toMatchObject({})
})

test('should fail to deploy contract with placeholders without links', async () => {
  await expect(web3.deploy('WithLinks', [], { from, gas })).rejects.toMatchObject({
    message: 'Missing links for "__$d350073c68faf3b499efe87de0a25a404f$__", "__$810a585bd7d462ceee4c7f3ccf691024bb$__". Did you forget to provide those links when deploying?'
  })
})

test('should deploy linked contract', async () => {
  web3.require('Library.sol')
  web3.require('LibraryNameThatOverflowsItsPlaceholderA.sol')
  web3.require('WithLinks.sol')
  const library = await web3.deploy('Library', [], { from, gas })
  const libraryA = await web3.deploy('LibraryNameThatOverflowsItsPlaceholderA', [], { from, gas })
  const links = {
    'Library.sol:Library': library.options.address,
    'LibraryNameThatOverflowsItsPlaceholderA.sol:LibraryNameThatOverflowsItsPlaceholderA': libraryA.options.address
  }
  const withLinks = await web3.deploy('WithLinks', [], { from, gas, links })
  expect(isChecksumAddress(withLinks.options.address)).toBe(true)
})

//
//     it('should reject extra links', async () => {
//       const links = {
//         '__Extra.sol:Extra_______________________': '0x0000000000000000000000000000000000000000',
//         '__Library.sol:Library___________________': '0x0000000000000000000000000000000000000000',
//         '__LibraryNameThatOverflowsItsPlacehold__': '0x0000000000000000000000000000000000000000'
//       }
//       await expect(web3.deploy('WithLinks', [], { from, gas, links })).to.reject(
//         'Unnecessary extra links provided "__Extra.sol:Extra_______________________".'
//       )
//     })
//
//     it('should not throw on interface require', () => {
//       expect(() => web3.require('OwnedSet.sol')).to.not.throw()
//     })
//
//   })
//
// })
