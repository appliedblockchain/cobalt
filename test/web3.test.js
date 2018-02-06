
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

})
