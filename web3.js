
const net = require('net')
const assert = require('assert')
const Web3 = require('web3')
const genache = require('ganache-core')
const seedGenacheAccounts = require('./seed-genache-accounts')
const { get, isFunction } = require('lodash')
const makeWeb3Require = require('./web3-require')
const web3Deploy = require('./web3-deploy')

const DEFAULT_PROVIDER = 'genache'
const DEFAULT_ACCOUNTS = 1000
const DEFAULT_GAS_LIMIT = 50000000
const DEFAULT_CHAIN_ID = 0x11
const DEFAULT_IPC = './parity/jsonrpc.ipc'

const providers = {

  // TODO: Not complete/tested.
  parity({ ipc = DEFAULT_IPC, accounts: n = DEFAULT_ACCOUNTS } = {}) {
    const accounts = seedGenacheAccounts(n) // TODO: FIXME:
    const provider = new Web3.providers.IpcProvider(ipc, net)
    return { provider, accounts, close: null }
  },
  genache({ accounts: n = DEFAULT_ACCOUNTS, chainId = DEFAULT_CHAIN_ID, gasLimit = DEFAULT_GAS_LIMIT, logger = null } = {}) {
    const accounts = seedGenacheAccounts(n)
    const provider = genache.provider({
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
