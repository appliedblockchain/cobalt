
process.on('warning', err => console.warn(err.stack))

const { expect } = require('code')
const Web3 = require('../web3')
const { web3, accounts } = require('../web3')({ accounts: 10 })
const isChecksumAddress = require('../is-checksum-address')

const from = accounts[0].address
const gas = 50000000

describe('web3', function () {

  it('should require, deploy and do at', async () => {
    web3.require('HelloWorld.sol')
    const helloWorld = await web3.deploy('HelloWorld', [], { from, gas })
    expect(isChecksumAddress(helloWorld.options.address)).to.be.true
    const helloWorld2 = web3.at('HelloWorld', helloWorld.options.address)
    expect(await helloWorld2.methods.helloWorld().call()).to.equal('Hello world!')
  })

  describe('provider', function () {
    it('can use parity as a provider', () => {
      // eslint-disable-next-line
      const web3 = Web3({ provider: 'parity'})

      expect(web3.provider.constructor.name).to.equal('HttpProvider')
      expect(web3.provider.host).to.equal('http://localhost:8545')
    })

    it('can set the url for the parity provider, and it can be a websocket', () => {
      // eslint-disable-next-line
      const web3 = Web3({ provider: 'parity', host: 'ws://myhost:8546' })

      expect(web3.provider.constructor.name).to.equal('WebsocketProvider')
    })

    it('throws an error if the parity host is invalid', () => {
      // eslint-disable-next-line
      expect(() => {Web3({ provider: 'parity', host: 'wXs://myhost' })})
        .to.throw(Error)
    })

    it('use the default ipc provider when the host starts with ipc', () => {
      // eslint-disable-next-line
      const web3 = Web3({ provider: 'parity', host: 'ipc:///somepath' })

      expect(web3.provider.constructor.name).to.equal('IpcProvider')
      expect(web3.provider.path).to.equal('ipc:///somepath')
    })
  })

  describe('link', function () {

    it('should fail to require contract having ambiguous placeholder links', () => {
      expect(() => web3.require('Ambiguous.sol')).to.throw('Ambiguous placeholders __LibraryNameThatOverflowsItsPlacehold__.')
    })

    it('should require contract with placeholders', () => {
      expect(web3.require('WithLinks.sol')).to.be.an.object()
    })

    it('should fail to deploy contract with placeholders without links', async () => {
      await expect(web3.deploy('WithLinks', [], { from, gas })).to.reject(
        'Missing links for "__Library.sol:Library___________________", "__LibraryNameThatOverflowsItsPlacehold__". Did you forget to provide those links when deploying?'
      )
    })

    it('should deploy linked contract', async () => {
      web3.require('Library.sol')
      web3.require('LibraryNameThatOverflowsItsPlaceholderA.sol')
      web3.require('WithLinks.sol')
      const library = await web3.deploy('Library', [], { from, gas })
      const libraryA = await web3.deploy('LibraryNameThatOverflowsItsPlaceholderA', [], { from, gas })
      const links = {
        '__Library.sol:Library___________________': library.options.address,
        '__LibraryNameThatOverflowsItsPlacehold__': libraryA.options.address
      }
      const withLinks = await web3.deploy('WithLinks', [], { from, gas, links })
      expect(isChecksumAddress(withLinks.options.address)).to.be.true()
    })

    it('should reject extra links', async () => {
      const links = {
        '__Extra.sol:Extra_______________________': '0x0000000000000000000000000000000000000000',
        '__Library.sol:Library___________________': '0x0000000000000000000000000000000000000000',
        '__LibraryNameThatOverflowsItsPlacehold__': '0x0000000000000000000000000000000000000000'
      }
      await expect(web3.deploy('WithLinks', [], { from, gas, links })).to.reject(
        'Unnecessary extra links provided "__Extra.sol:Extra_______________________".'
      )
    })

    it('should not throw on interface require', () => {
      expect(() => web3.require('OwnedSet.sol')).to.not.throw()
    })

  })

})
