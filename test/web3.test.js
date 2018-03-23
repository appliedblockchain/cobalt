
require('chai').use(require('chai-as-promised'))

const { web3, accounts } = require('../web3')({ accounts: 10 })
const isChecksumAddress = require('../is-checksum-address')
const { expect } = require('chai')

const from = accounts[0].address
const gas = 50000000

describe('web3', function () {

  it('should require, deploy and do at', async () => {
    web3.require('HelloWorld.sol')
    const helloWorld = await web3.deploy('HelloWorld', [], { from, gas })
    expect(isChecksumAddress(helloWorld.options.address)).to.be.true
    const helloWorld2 = web3.at('HelloWorld', helloWorld.options.address)
    expect(await helloWorld2.methods.helloWorld().call()).to.eq('Hello world!')
  })

  describe('link', function () {

    it('should fail to require contract having ambiguous placeholder links', () => {
      expect(() => web3.require('Ambiguous.sol')).to.throw('Ambiguous placeholders __LibraryNameThatOverflowsItsPlacehold__.')
    })

    it('should require contract with placeholders', () => {
      web3.require('WithLinks.sol')
    })

    it('should fail to deploy contract with placeholders without links', async () => {
      await expect(web3.deploy('WithLinks', [], { from, gas })).to.rejectedWith(
        'Missing links for "__Library.sol:Library___________________", "__LibraryNameThatOverflowsItsPlacehold__".'
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
      expect(isChecksumAddress(withLinks.options.address)).to.be.true
    })

    it('should reject extra links', async () => {
      const links = {
        '__Extra.sol:Extra_______________________': '0x0000000000000000000000000000000000000000',
        '__Library.sol:Library___________________': '0x0000000000000000000000000000000000000000',
        '__LibraryNameThatOverflowsItsPlacehold__': '0x0000000000000000000000000000000000000000'
      }
      await expect(web3.deploy('WithLinks', [], { from, gas, links })).to.be.rejectedWith(
        'Unnecessary extra links provided "__Extra.sol:Extra_______________________".'
      )
    })

  })

})
