
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
 * @param {string} .solcVersion Solidity docker image tag to use. Overrides solc option.
 * @return {function} Compiler function.
 */
function make({ root = DEFAULT_ROOT, solc = DEFAULT_SOLC, allowPaths, solcVersion } = {}) {

  const allowPathsParam = allowPaths ?
    `--allow-paths ${allowPaths}` :
    ''

  if (solcVersion) {
    solc = `docker run -v $(pwd):/solidity ethereum/solc:${solcVersion}`
  }

  function compile(name) {
    const { stdout, stderr } = sh(`cd ${root} && ${solc} ${allowPathsParam} --combined-json abi,bin ${name}`)
    if (stderr) {
      throw new Error('stderr', { stdout, stderr })
    }
    return parseSolcJson(stdout)
  }

  return compile
}

module.exports = make
