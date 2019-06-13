
const sh = require('./sh-sync')
const parseSolcJson = require('./parse-solc-json')

const DEFAULT_ROOT = './contracts'
const DEFAULT_SOLC = process.env.SOLC || 'solc'

/**
 * Make solidity compiler for `root` base path with contracts.
 *
 * Usage:
 *
 *    const { join } = require('path')
 *    const solc = require('@appliedblockchain/cobalt/solc')({ root: join(__dirname, '..', 'contracts`) })
 *    const { abi, bin } = solc('Foo.sol')
 *
 * @param {string} .root = DEFAULT_ROOT ('./contracts') Contracts' root directory.
 * @param {string} .solc = DEFAULT_SOLC ('solc') Solidity compiler should be on your PATH.
 * @param {string} .evmVersion
 * @param {string} .allowPaths
 * @return {function} Compiler function.
 */
function make({ root = DEFAULT_ROOT, solc = DEFAULT_SOLC, evmVersion, allowPaths } = {}) {

  const evmVersionString = evmVersion ?
    `--evm-version ${evmVersion}` :
    ''

  const allowPathsString = allowPaths ?
    `--allow-paths ${allowPaths}` :
    ''

  function compile(name) {
    const { stdout, stderr } = sh(`cd ${root} && ${solc} ${evmVersionString} ${allowPathsString} --combined-json abi,bin ${name}`)
    if (stderr) {
      throw new Error('stderr', { stdout, stderr })
    }
    return parseSolcJson(stdout)
  }

  return compile
}

module.exports = make
