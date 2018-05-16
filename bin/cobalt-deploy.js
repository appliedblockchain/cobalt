#!/usr/bin/env node

const { get, isString } = require('lodash')
const program = require('commander')
const pkg = require('../package.json')
const makeWeb3 = require('../web3')
const makeProvider = require('../make-provider')
const isHex0x = require('../is-hex0x')

program
  .version(pkg.version)
  .option('-p, --provider [provider]', 'Set provider.', 'http://localhost:8545')
  .option('-r, --root [root]', 'Contract\'s root directory.', './contracts')
  .option('-s, --sol <sol>', 'Solidity file.')
  .option('-c, --contract [contract]', 'Contract name, defaults to solidity file without extension.')
  .option('-a, --args [args]', 'Constructor arguments as json.', '[]')
  .option('-g, --gas [gas]', 'Gas.', '50000000')
  .option('-f, --from <from>', '0x... address.')
  .parse(process.argv)

if (!program.sol) {
  console.log('Please provide solidity file via -s, --sol argument, ie. "-s Foo.sol".')
  process.exit(-1)
}

// If contract is not provided use solidity file name without extension.
const contract = program.contract ?
  program.contract :
  program.sol.slice(0, -4)

if (!isHex0x(program.from)) {
  console.error('Please provide -f, --from argument, ie. "-f 0xfa9c654833f3e977b0f7c07c60bb69b656a47af7".')
  process.exit(-1)
}

const provider = makeProvider(program.provider)
const { root, sol, args, from, gas } = program
const { web3 } = makeWeb3({ provider, root })

web3.require(sol)

web3.deploy(contract, isString(args) ? JSON.parse(args) : args, { from, gas })
  .then(result => {
    console.log(get(result, 'options.address'))
  })
  .catch(err => {
    console.error(get(err, 'stack', err))
    process.exit(-1)
  })
