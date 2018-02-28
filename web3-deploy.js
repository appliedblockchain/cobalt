
const { get, has } = require('lodash')
const linkLibraries = require('./link-libraries')

const nullAddress = '0x0000000000000000000000000000000000000000'

/**
 * Usage:
 *
 *   web3.deploy = require('bmono/web3-deploy')
 *   const foo = await web3.deploy('Foo', [], { from, gas, links: {Lib1: '0x123...', Lib2: '0x234...'} })
 *   await foo.methods.bar().send({ from, gas })
 *
 * @param {string} name Name of the contract to deploy. Contract needs to be compiled with `web3.compile` before.
 * @param {any[]} args Arguments to be passed to contract's constructor.
 * @param {{ from, gas }} Transaction options.
 * @param {<library name>: <library address>} Libraries linking options.
 */
async function web3Deploy(name, args = [], { from, gas, links = {} } = {}) {

  // Check if contract has been registered.
  if (!has(this, ['ctr', name])) {
    throw new Error(`${name} contract not found, did you forget web3.require('${name}.sol')?`)
  }

  const deploymentOptions = { arguments: args }

  if (Object.keys(links).length > 0) { // we need to link the contract with deployed dependencies (libraries)
    const unlinkedBytecode = this.ctr[name].options.data
    const linkedBytecode = linkLibraries(unlinkedBytecode, links)

    deploymentOptions.data = linkedBytecode
  }

  const result = await this.ctr[name]
    .deploy(deploymentOptions)
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
