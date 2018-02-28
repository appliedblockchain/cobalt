
const { web3, accounts } = require('../web3')({ accounts: 10 })
const isHex0x = require('../is-hex0x')
const { expect } = require('chai')

const from = accounts[0].address
const gas = 50000000

describe('web3', function () {

  it('should require, deploy and do at', async () => {
    web3.require('HelloWorld.sol')
    const helloWorld = await web3.deploy('HelloWorld', [], { from, gas })
    expect(isHex0x(helloWorld.options.address)).to.be.true
    const helloWorld2 = web3.at('HelloWorld', helloWorld.options.address)
    expect(await helloWorld2.methods.helloWorld().call()).to.eq('Hello world!')
  })

  it('should deploy contracts with linked libraries', async () => {
    const { Contract } = web3.require('Contract.sol')
    const contractByteCode = Contract.options.data

    expect(isHex0x(contractByteCode)).to.be.false // the byte code is not valid and has a reference to the Library

    const library = await web3.deploy('Library', [], { from, gas })
    const contractWithLibrary = await web3.deploy('Contract', [], { from, gas, links: { Library: library.options.address } })

    expect(isHex0x(contractWithLibrary.options.address)).to.be.true
    expect(await contractWithLibrary.methods.emitIfNonEmpty('abcd').call()).to.eq('4')
  })

})
