
const path = require('path')
const sh = require('./sh-sync')

const DEFAULT_ROOT = './contracts'
const DEFAULT_SOLC = 'solc'

/**
 * Make solidity compiler for `root` base path with contracts.
 *
 * Usage:
 *
 *    const solc = require('bmono/solc')({ root: `${__dirname}/../contracts` })
 *    const { abi, bin } = solc('Foo.sol')
 *
 * @param {string} .root = DEFAULT_ROOT ('./contracts') Contracts' root directory.
 * @param {string} .solc = DEFAULT_SOLC ('solc') Solidity compiler should be on your PATH.
 * @return {function} Compiler function.
 */
function make({ root = DEFAULT_ROOT, solc = DEFAULT_SOLC } = {}) {

  function compile(name) {
    const { stdout, stderr } = sh(`${solc} --combined-json abi,bin ${path.join(root, name)}`)
    if (stderr) {
      throw new Error('stderr', { stdout, stderr })
    }
    const parsed = JSON.parse(stdout)
    const r = {}
    for (const [key, { bin, abi }] of Object.entries(parsed.contracts)) {
      r[key.split(':')[1]] = { abi: JSON.parse(abi), bin: bin ? '0x' + bin : null }
    }
    return r
  }

  return compile
}

module.exports = make
