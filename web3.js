
// const net = require('net')
const assert = require('assert')
const Web3 = require('web3')
const ganache = require('ganache-core')
const seedGanacheAccounts = require('./seed-ganache-accounts')
const { has, get, isFunction, isInteger } = require('lodash')
const makeWeb3Require = require('./web3-require')
const web3Deploy = require('./web3-deploy')

const DEFAULT_PROVIDER = 'ganache'
const DEFAULT_ACCOUNTS = 1000
const DEFAULT_GAS_LIMIT = 50000000
const DEFAULT_CHAIN_ID = 0x11
const DEFAULT_IPC = `${process.env.HOME}/.local/share/io.parity.ethereum/jsonrpc.ipc`

const providers = {

  // TODO: Not complete/tested.
  parity({ ipc = DEFAULT_IPC, accounts: n = DEFAULT_ACCOUNTS } = {}) {
    console.log({ ipc })
    const accounts = seedGanacheAccounts(n) // TODO: FIXME:
    // const provider = new Web3.providers.IpcProvider(ipc, net)
    // const provider = new Web3.providers.WebsocketProvider('ws://localhost:8546')
    const provider = new Web3.providers.HttpProvider('http://localhost:8545')
    return { provider, accounts, close: null }
  },

  ganache({ accounts: n = DEFAULT_ACCOUNTS, chainId = DEFAULT_CHAIN_ID, gasLimit = DEFAULT_GAS_LIMIT, logger = null } = {}) {
    const accounts = seedGanacheAccounts(n)
    const provider = ganache.provider({
      logger,
      unlocked_accounts: accounts.map(_1 => _1.address),
      accounts,
      network_id: chainId,
      gasLimit
    })
    return { provider, accounts, close: null }
  }
}

/**
 * @param {number} .accounts Number of accounts to generate.
 * @param {string} .root Contract's root for `web3.require` so `solc` compiler knows where to look for `.sol` files.
 * @param {solc} .solc Alternative to root, pass `solc` compiler directly.
 *
 * @return {{ web3: Web3, accounts: array, provider }}
 */
function makeWeb3(options = {}) {

  // Make sure we don't get ganache like keys.
  if (has(options, 'networkId') || has(options, 'network_id')) {
    throw new TypeError('Please use chainId instead of networkId or network_id.')
  }

  // Make sure chain id is sane and in safe range.
  if (has(options, 'chainId')) {
    if (!isInteger(options.chainId) || (options.chainId < 0 || options.chainId > 109)) {
      throw new TypeError(`Expected chainId to be integer in 0 to 109 range, got ${options.chainId}.`)
    }
  }

  const name = get(options, 'provider', DEFAULT_PROVIDER)
  const { provider, accounts, close } = providers[name](options)
  const web3 = new Web3(provider)

  // Decorate with `require`.
  const root = get(options, 'root')
  const solc = get(options, 'solc')
  assert(!web3.require, 'Can\'t overwrite web3.require.')
  web3.require = makeWeb3Require({ root, solc })

  // Decorate with `deploy`.
  assert(!web3.deploy, 'Can\'t overwrite web3.deploy.')
  web3.deploy = web3Deploy

  // Decorate with `close` to close provider - if it's one of those that are hanging.
  assert(!web3.close, 'Can\'t overwrite close.')
  web3.close = function () {
    if (isFunction(close)) {
      return close.call(web3)
    }
  }

  return { web3, accounts, provider }
}

module.exports = makeWeb3
