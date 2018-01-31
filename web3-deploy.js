
const { get, has } = require('lodash')

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

  // Check if contract has been registered.
  if (!has(this, ['ctr', name])) {
    throw new Error(`${name} contract not found, did you forget web3.require('${name}.sol')?`)
  }

  const result = await this.ctr[name]
    .deploy({ arguments: args })
    .send({
      from,
      gas
    })

  // Check if contract has been deployed.
  if (get(result, 'options.address', nullAddress) === nullAddress) {
    throw new Error(`${name} contract couldn't be deployed, maybe abstract interface does't match?`)
  }

  result.setProvider(this.currentProvider)
  return result
}

module.exports = web3Deploy
