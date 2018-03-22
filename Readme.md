
## Summary

`bmono` (blockchain monorepo/npm), for rapid prototyping.

## Prerequisites

`bmono` is using command line compiler, make sure it's installed:

    brew update
    brew upgrade
    brew tap ethereum/ethereum
    brew install solidity
    brew linkapps solidity

Confirm it's installed:

    solc --version

## Installation

Make sure you've got access to private @appliedblockchain npms:

    npm login

Add as development dependency:

    npm i -D @appliedblockchain/bmono

## Usage

See [examples](./examples) directory.

### Example jest test

`test/foo.test.js`

    const { map, first } = require('lodash')
    const { web3, accounts } = require('@appliedblockchain/web3')({
      // root: `${__dirname}/../contracts`, // Contracts directory, defaults to `contracts` in project root.
      accounts: 10
    })

    const addresses = map(accounts, 'address')
    const from = first(addresses)
    const gas = 50000000

    // Compile one or more sol files.
    web3.require('Foo.sol')

    afterAll(async () => {
      web3.close()
    })

    let foo

    test('deploys', async () => {

      // Second argument, an empty array is a list of constructor arguments of this contract.
      foo = await web3.deploy('Foo', [], { from, gas })
      expect(foo.options.address).toBe('string')
    })

    test('calls', async () => {
      expect(await foo.methods.getFoo().call()).toEqual('foo')
    })

    test('sends', async () => {
      expect(await foo.methods.sendFoo().send({ from, gas })).toBe('object')
    })
