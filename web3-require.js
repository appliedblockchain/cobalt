
const assert = require('assert')
const isDir = require('./is-dir-sync')
const { each, set, uniq, map, isString } = require('lodash')
const bytecodePlaceholders = require('./bytecode-placeholders')

function throwOnAmbiguousPlaceholders(bytecode) {

  // Skip check on empty bytecode for interfaces.
  if (bytecode == null || bytecode === '') {
    return
  }

  const ps = bytecodePlaceholders(bytecode)
  const xs = uniq(map(ps.filter(_1 => _1.ambiguous && !_1.name.endsWith('___')), 'name'))
  if (xs.length) {
    throw new Error(`Ambiguous placeholders ${xs.join(', ')}.`)
  }
}

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
 * @param {solc} .solc
 */
function make({ root, solc, allowPaths }) {

  // When `root` is defined, construct `solc`.
  if (root) {
    assert(!solc, 'Expected solc to be nil.')
    solc = require('./solc')({ root, allowPaths })
  }

  // Try to see if we can see `./contracts`.
  if (!solc && isDir('./contracts')) {
    solc = require('./solc')({ root: './contracts', allowPaths })
  }

  // At this point, we need to have `solc` defined.
  assert(solc, 'Expected solc (or root) to be set.')

  // Return require function. It needs to be bound to Web3.prototype` or `web3`.
  return function web3Require(filename, { from } = {}) {

    assert(isString(filename), 'Expected string as filename.')

    if (!filename.endsWith('.sol')) {
      throw new Error(`Expected .sol file name, but got ${JSON.stringify(filename)}. Did you forget to add .sol extension?`)
    }

    each(solc(filename), ({ abi, bin: data }, key) => {
      throwOnAmbiguousPlaceholders(data)
      set(this, ['ctr', key], new this.eth.Contract(abi, { from, data }))
    })
    return this.ctr
  }

}

module.exports = make
