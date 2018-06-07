
## Summary

Fast, lightweight ethereum dapp prototyping.

### What is it? What's the difference compared to truffle?

Truffle team did a great job, if truffle framework works for you - you should stay with it.

Cobalt is an alternative take on ethereum dapp development. It's lightweight, no magic (globals etc.), instant compilation (for ultra-short modify-compile-test cycle) same web3@1.x api in tests and production code, straight forward deployment without migrations (we think dapps have more complex deployment story than patterns based on traditional database migrations), small codebase.

Cobalt gives you decorated web3 with:
* `web3.require('Foo.sol')` - which compiles solidity files and makes them available for deployment, and
* `const foo = async web3.deploy('Foo', [], { from, gas, links?: { ... }, ... })` - to deploy a contract.

That's all - the rest are helpers to simplify common tasks during dapp development.

## Prerequisites

`cobalt` uses the `solc` command-line compiler, make sure you've got it:

    brew update
    brew upgrade
    brew tap ethereum/ethereum
    brew install solidity
    brew linkapps solidity

Confirm it's installed:

    solc --version

If you want to setup Circle CI or similar CI, you can fetch `solc` compiler with:

    wget https://github.com/ethereum/solidity/releases/download/v0.4.23/solc-static-linux && chmod +x solc-static-linux && sudo mv solc-static-linux /usr/bin/solc

## Installation

    npm i -D @appliedblockchain/cobalt

## Usage

See [examples](./examples) directory.

## Deploy

To deploy a contract from your terminal you can use something like:

    cobalt-deploy -g 5000000 -f 0xfa9c654833f3e977b0f7c07c60bb69b656a47af7 -s HelloWorld.sol

### Example jest test

`test/foo.test.js`

    const { join } = require('path')
    const { map, first } = require('lodash')
    const { web3, accounts } = require('@appliedblockchain/cobalt/web3')({
      root: join(__dirname, '..', 'contracts'), // Contracts directory, defaults to `./contracts`.
      accounts: 10,
      logger: console,
    })

    const addresses = map(accounts, 'address')
    const from = first(addresses)
    const gas = 50000000

    // Compile one or more .sol files.
    web3.require('Foo.sol')

    afterAll(async () => {
      web3.close()
    })

    let foo

    test('deploys', async () => {
      // The second argument, an empty array, is a list of constructor arguments for this contract.
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
