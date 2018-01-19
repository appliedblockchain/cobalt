
const assert = require('assert')
const Web3 = require('web3')
const { each, set } = require('lodash')

const nullAddress = '0x0000000000000000000000000000000000000000'

/**
 * Usage:
 *
 *   const solc = require('bmono/make-solc')(`${__dirname}/../contracts`)
 *   require('bmono/web3-compile-deploy')(solc)
 *
 *   const Web3 = require('web3')
 *   const web3 = new Web3(...)
 *   web3.compile('Foo.sol')
 *   const foo = await web3.deploy('Foo', [], { from, gas })
 *
 * @param {solc} solc
 */
function web3CompileDeploy(solc) {

  Web3.prototype.require = function (filename, { from } = {}) {
    each(solc(filename), ({ abi, bin: data }, key) => {
      set(this, ['ctr', key], new this.eth.Contract(abi, { from, data }))
    })
    return this.ctr
  }

  Web3.prototype.deploy = async function (name, args, { from, gas } = {}) {
    const result = await this.ctr[name]
      .deploy({ arguments: args })
      .send({
        from,
        gas
      })
    assert(result.options.address !== nullAddress, 'Expected deployed contract to have an address.')
    result.setProvider(this.currentProvider)
    return result
  }

}

module.exports = web3CompileDeploy
