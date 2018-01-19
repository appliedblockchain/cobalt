
const path = require('path')
const { random } = require('lodash')
const { web3, accounts } = require('../web3')({
  root: path.join(__dirname, 'contracts'),
  accounts: 100
})
const makeProgress = require('../make-progress')
const runMain = require('../run-main')
const puts = require('../puts')

// Compile solidity file.
web3.require('Erc20Mock.sol')

async function main() {

  const from = accounts[0].address
  const gas = 50000000

  // Deploy contract.
  const erc20Mock = await web3.deploy('Erc20Mock', [], { from, gas })

  // Set random erc20 balances.
  {
    const progress = makeProgress('erc20 balances', accounts.length)
    for (const { address } of accounts) {
      await erc20Mock.methods.setBalanceOf(address, random(1000).toString()).send({ from, gas })
      progress.tick()
    }
  }

  // Dump balances.
  for (const { address } of accounts) {
    const balance = await erc20Mock.methods.balanceOf(address).call({ from })
    puts('%s balance %10s', address, balance)
  }

}

runMain(main)
