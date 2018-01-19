
const assert = require('assert')
const { get } = require('lodash')

const nullAddress = '0x0000000000000000000000000000000000000000'

/**
 * Usage:
 *
 *   web3.deploy = require('bmono/web3-deploy')
 *   const foo = await web3.deploy('Foo', [], { from, gas })
 *   await foo.methods.bar().send({ from, gas })
 *
 * @param {string} name Name of the contract to deploy. Contract needs to be compiled with `web3.compile` before.
 * @param {any[]} args Arguments to be passed to contract's constructor.
 * @param {{ from, gas }} Transaction options.
 */
async function web3Deploy(name, args = [], { from, gas } = {}) {
  const result = await this.ctr[name]
    .deploy({ arguments: args })
    .send({
      from,
      gas
    })
  assert(get(result, 'options.address') !== nullAddress, 'Expected deployed contract to have an address.')
  result.setProvider(this.currentProvider)
  return result
}

module.exports = web3Deploy
