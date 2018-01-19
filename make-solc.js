
const sh = require('./sh-sync')

const DEFAULT_SOLC = '/usr/local/bin/solc'

/**
 * Make solidity compiler for `root` base path with contracts.
 *
 * Usage:
 *
 *    const solc = makeCompiler(`${__dirname}/../contracts`)
 *    const { abi, bin } = solc('Foo.sol')
 *
 * @param {string} root Contracts' root directory.
 * @param {string} 1.solc = '/usr/local/bin/solc' Solidity compiler executable path.
 * @return {function} Compiler function.
 */
function makeSolc(root, { solc = DEFAULT_SOLC } = {}) {

  function compile(name) {
    const { stdout, stderr } = sh(`${solc} --combined-json abi,bin ${root}/${name}`)
    if (stderr) {
      throw new Error('stderr', { stdout, stderr })
    }
    const parsed = JSON.parse(stdout)
    const r = {}
    for (const [key, { bin, abi }] of Object.entries(parsed.contracts)) {
      r[key.split(':')[1]] = { abi: JSON.parse(abi), bin: '0x' + bin }
    }
    return r
  }

  return compile
}

module.exports = makeSolc
