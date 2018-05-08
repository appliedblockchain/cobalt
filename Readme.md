
## Summary

Fast, lightweight ethereum dapp prototyping.

## Prerequisites

`cobalt` is using command line compiler, make sure it's installed:

    brew update
    brew upgrade
    brew tap ethereum/ethereum
    brew install solidity
    brew linkapps solidity

Confirm it's installed:

    solc --version

To fetch `solc` compiler in CI (Linux) you can use:

    wget https://github.com/ethereum/solidity/releases/download/v0.4.23/solc-static-linux && chmod +x solc-static-linux && sudo mv solc-static-linux /usr/bin/solc

## Installation

Make sure you've got access to private @appliedblockchain npms:

    npm login

Add as development dependency:

    npm i -D @appliedblockchain/cobalt

## Usage

See [examples](./examples) directory.

### Example jest test

`test/foo.test.js`

    const { map, first } = require('lodash')
    const { web3, accounts } = require('@appliedblockchain/cobalt/web3')({
      // root: `${__dirname}/../contracts`, // Contracts directory, defaults to `contracts` in project root.
      accounts: 10,
      logger: console,
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

## License

MIT License

Copyright 2018 Applied Blockchain

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
