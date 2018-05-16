
const { expect } = require('code')

const { web3, accounts } = require('../web3')({
  root: `${__dirname}/../contracts`
})

const from = accounts[0].address
const gas = 50000000

describe('without solc', function () {

  let helloWorld

  it('should require', () => {
    web3.require('HelloWorld.json')
  })

  it('should deploy', async () => {
    helloWorld = await web3.deploy('HelloWorld', [], { from, gas })
  })

  it('should be able to call', async () => {
    expect(await helloWorld.methods.helloWorld().call()).to.equal('Hello world!')
  })

})
