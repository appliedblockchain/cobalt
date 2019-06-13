
const fs = require('fs')
const path = require('path')
const assert = require('assert')
const isDir = require('./is-dir-sync')
const { each, set, isString } = require('lodash')
const parseSolcJson = require('./parse-solc-json')

/**
 * Usage:
 *
 *   const { join } = require('path')
 *   const solc = require('@appliedblockchain/cobalt/make-solc')({ root: join(__dirname, '..', 'contracts') })
 *   require('@appliedblockchain/cobalt/web3-compile-deploy')(solc)
 *
 *   const Web3 = require('web3')
 *   const web3 = new Web3(...)
 *   web3.compile('Foo.sol')
 *   const foo = await web3.deploy('Foo', [], { from, gas })
 *
 * @param {solc} .solc
 * @returns {object} an ethereum contract
 */
function make({ root, solc: maybeSolc, evmVersion, allowPaths }) {

  // Effective solc.
  let solc = maybeSolc

  // When `root` is defined, construct `solc`.
  if (root) {
    assert(!solc, 'Expected solc to be nil.')
    solc = require('./solc')({ root, evmVersion, allowPaths })
  }

  // Try to see if we can see `./contracts`.
  if (!solc && isDir('./contracts')) {
    solc = require('./solc')({ root: './contracts', evmVersion, allowPaths })
  }

  // At this point, we need to have `solc` defined.
  assert(solc, 'Expected solc (or root) to be set.')

  // Return require function. It needs to be bound to Web3.prototype` or `web3`.
  return function web3Require(filename, { from } = {}) {

    assert(isString(filename), 'Expected string as filename.')

    if (!filename.endsWith('.sol') && !filename.endsWith('.json')) {
      throw new Error(`Expected .sol or .json file name, but got ${JSON.stringify(filename)}. Did you forget to add .sol or .json extension?`)
    }

    const parsed = filename.endsWith('.json') ?
      parseSolcJson(fs.readFileSync(path.join(root || './contracts', filename), 'utf8')) :
      solc(filename)

    each(parsed, ({ abi, bin: data }, key) => {
      set(this, [ 'ctr', key ], new this.eth.Contract(abi, { from, data }))
    })

    return this.ctr
  }

}

module.exports = make
