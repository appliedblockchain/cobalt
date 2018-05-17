#!/usr/bin/env node

const program = require('commander')
const pkg = require('../package.json')
const makeWeb3 = require('../web3')

program
  .version(pkg.version)
  .option('-r, --root [root]', 'Contract\'s root directory.', './contracts')
  .option('-s, --sol <sol>', 'Solidity file.')
  .option('--solc-version <version>', 'Solidity compiler version.')
  .parse(process.argv)

// Solidity file is required.
if (!program.sol) {
  console.log('Please provide solidity file via -s, --sol argument, ie. "-s Foo.sol".')
  process.exit(-1)
}

const { root, sol, solcVersion } = program
const { web3 } = makeWeb3({ root, solcVersion })

web3.require(sol)

const compiled = getCompiledContracts()
console.log(JSON.stringify(compiled, null, 2))

function getCompiledContracts() {
  const output = {}
  for (const [ name, ctr ] of Object.entries(web3.ctr)) {
    const abi = JSON.stringify(ctr.options.jsonInterface)
    const bin = ctr.options.data
    output[name] = { abi, bin }
  }
  return output
}
