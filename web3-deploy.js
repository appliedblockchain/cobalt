
const { get, has } = require('lodash')
const bytecodeLink = require('./bytecode-link')

const nullAddress = '0x0000000000000000000000000000000000000000'

/**
 * Usage:
 *
 *   web3.deploy = require('@appliedblockchain/cobalt/web3-deploy')
 *   const links = { '__Library.sol:Library___________________': '0x0000000000000000000000000000000000000000' }
 *   const foo = await web3.deploy('Foo', [], { from, gas, links })
 *   await foo.methods.bar().send({ from, gas })
 *
 * @param {string} name Name of the contract to deploy. Contract needs to be compiled with `web3.compile` before.
 * @param {array} args Arguments to be passed to contract's constructor.
 * @param {object} options Deployment options.
 * @param {address} options.from
 * @param {string | number} options.gas
 * @param {object?} options.links Links to libraries.
 * @returns {object} object with provider and address.
 */
async function web3Deploy(name, args = [], { from, gas, links = {} } = {}) {

  // Check if contract has been registered.
  if (!has(this, [ 'ctr', name ])) {
    throw new Error(`${name} contract not found, did you forget web3.require('${name}.sol')?`)
  }

  const unlinkedBytecode = this.ctr[name].options.data
  const linkedBytecode = bytecodeLink(unlinkedBytecode, links)

  const deployOptions = {
    arguments: args,
    data: unlinkedBytecode === linkedBytecode ?
      void 0 :
      linkedBytecode
  }

  const result = await this.ctr[name]
    .deploy(deployOptions)
    .send({
      from,
      gas
    })

  // Check if contract has been deployed.
  if (get(result, 'options.address', nullAddress) === nullAddress) {
    throw new Error(`${name} contract couldn't be deployed, maybe abstract interface does't match?`)
  }

  // Apparently we need to re-set current provider.
  result.setProvider(this.currentProvider)

  return result
}

module.exports = web3Deploy
