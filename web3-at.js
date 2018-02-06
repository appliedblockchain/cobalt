
const { has } = require('lodash')

/**
 * Usage:
 *
 *   const address = '0x...'
 *   const foo = web3.at('Foo', address)
 *   await foo.methods.foo().send({ from, gas })
 *
 * @param {string} name Name of the contract. Contract needs to be compiled with `web3.compile` before.
 * @param {string} address Contract's address.
 */
function web3At(name, address) {

  // Check if contract has been registered.
  if (!has(this, ['ctr', name])) {
    throw new Error(`${name} contract not found, did you forget web3.require('${name}.sol')?`)
  }

  const result = this.ctr[name].clone()
  result.setProvider(this.currentProvider)
  result.options.address = address

  return result
}

module.exports = web3At
