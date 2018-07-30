
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
    it('can autodetect the provider when passed a string', () => {
      // eslint-disable-next-line new-cap
      let web3 = Web3({ provider: 'http://localhost:8545' })
      expect(web3.provider.constructor.name).to.equal('HttpProvider')


      // eslint-disable-next-line new-cap
      web3 = Web3({ provider: 'ws://myhost:8546' })
      expect(web3.provider.constructor.name).to.equal('WebsocketProvider')


      // eslint-disable-next-line new-cap
      web3 = Web3({ provider: 'ipc:///somepath' })
      expect(web3.provider.constructor.name).to.equal('IpcProvider')
    })

    it('throws an error if the provider is invalid', () => {
      expect(() => {
        Web3({ provider: 'wXs://myhost' }) // eslint-disable-line new-cap
      }).to.throw(Error)
    })
  })

  describe('accounts generation', function () {
    describe('with default mnemonic', function () {
      it('it automatically generates 1000 accounts', () => {
        const { accounts } = Web3() // eslint-disable-line new-cap
        expect(accounts.length).to.equal(1000)

        const account = accounts[0]
        expect(account.address).to.be
        expect(account.secretKey).to.be
        expect(account.publicKey).to.be
        expect(account.balance).to.equal('100')
      })
    })

    describe('mnemonic', function () {
      it('can start Ganache with custom mnemonic', () => {
        const mnemonic = 'invite velvet rug stage force avocado plug dance deny purity lava lizard'

        // eslint-disable-next-line new-cap
        const { accounts } = Web3({ mnemonic })
        expect(accounts.length).to.equal(1000)

        const account = accounts[0]

        expect(account.address).to.equal('0xd86f1b2887f29b565f55f7477d072497ce2a0ddb')
        expect(account.secretKey).to.equal('0x4b2ad151c877f6011b8d486487d8b3e87a4a840b056b7d5c77fa0a19311c55f1')
        expect(account.publicKey).to.equal('0x5deb33e7d5b73f6389f0d92444e0f8ed3891d7c927d4d20c03769618463107d5f16fe2060447f71b05ccc121701ff04d5c94b0f2e8154f577c5c055a867296f8')
        expect(account.balance).to.equal('100')
      })
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
