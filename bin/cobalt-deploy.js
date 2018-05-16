#!/usr/bin/env node

const path = require('path')
const assert = require('assert')
const { get, set } = require('lodash')
const program = require('commander')
const pkg = require('../package.json')
const makeWeb3 = require('../web3')
const makeProvider = require('../make-provider')
const isHex0x = require('../is-hex0x')
const isAddress = require('../is-address')
// const isBytecodePlaceholder = require('../is-bytecode-placeholder')

function mergeLink(e, r) {
  const [ k, v ] = e.split('=')
  assert((/__.{36}__/).test(k), `Expected bytecode placeholder in /__.{36}__/ format instead of ${JSON.stringify(k)} in --link ${JSON.stringify(e)} argument.`)
  assert(isAddress(v), `Expected an address in 0x... format instead of ${JSON.stringify(v)} in --link ${JSON.stringify(e)} argument.`)
  return set(r, k, v)
}

function jsonParse(value) {
  return JSON.parse(value)
}

program
  .version(pkg.version)
  .option('-p, --provider [provider]', 'Set provider.', 'http://localhost:8545')
  .option('-r, --root [root]', 'Contract\'s root directory.', './contracts')
  .option('-s, --sol <sol>', 'Solidity file.')
  .option('-c, --contract [contract]', 'Contract name, defaults to solidity file without extension.')
  .option('-a, --args [args]', 'Constructor arguments as json.', jsonParse, '[]')
  .option('-g, --gas [gas]', 'Gas.', '50000000')
  .option('-f, --from <from>', '0x... address.')
  .option('-l, --link <link>', 'Link in 0xfa9c654833f3e977b0f7c07c60bb69b656a47af7:__contracts/Library.sol:Library_________ format.', mergeLink, {})
  .parse(process.argv)

// Solidity file is required.
if (!program.sol) {
  console.log('Please provide solidity file via -s, --sol argument, ie. "-s Foo.sol".')
  process.exit(-1)
}

// If contract is not provided use basename from solidity file.
const contract = program.contract ?
  program.contract :
  path.basename(program.sol, '.sol')

// `from` has to be set.
if (!isHex0x(program.from)) {
  console.error('Please provide -f, --from argument, ie. "-f 0xfa9c654833f3e977b0f7c07c60bb69b656a47af7".')
  process.exit(-1)
}

const provider = makeProvider(program.provider)
const { root, sol, args, from, gas, link: links } = program
const { web3 } = makeWeb3({ provider, root })

web3.require(sol)

web3.deploy(contract, args, { from, gas, links })
  .then(result => {
    console.log(get(result, 'options.address'))
  })
  .catch(err => {
    console.error(get(err, 'message', err))
    process.exit(-1)
  })
