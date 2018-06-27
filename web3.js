
// const net = require('net')
// const { join } = require('path')
const assert = require('assert')
const Web3 = require('web3')
const ganache = require('ganache-core')
const seedGanacheAccounts = require('./seed-ganache-accounts')
const { has, get, isFunction, isInteger, isString } = require('lodash')
const makeWeb3Require = require('./web3-require')
const web3Deploy = require('./web3-deploy')
const web3At = require('./web3-at')

const DEFAULT_PROVIDER = 'ganache'
const DEFAULT_ACCOUNTS = 1000
const DEFAULT_GAS_LIMIT = 50000000
const DEFAULT_CHAIN_ID = 0x11
const DEFAULT_LOGGER = {
  log() {}
}

const DEFAULT_PARITY_HOST = 'http://localhost:8545'

const providers = {

  parity({ host = DEFAULT_PARITY_HOST } = {}) {
    let provider
    if (host.startsWith('http')) {
      provider = new Web3.providers.HttpProvider(host)
    } else if (host.startsWith('ws')) {
      provider = new Web3.providers.WebsocketProvider(host)
    } else {
      throw new Error('Invalid host url for provider: ' + host)
    }

    return { provider, accounts: [], close: null }
  },

  ganache({ accounts: n = DEFAULT_ACCOUNTS, chainId = DEFAULT_CHAIN_ID, gasLimit = DEFAULT_GAS_LIMIT, logger = DEFAULT_LOGGER, blocktime } = {}) {
    const accounts = seedGanacheAccounts(n)
    const provider = ganache.provider({
      logger,
      unlocked_accounts: accounts.map(_1 => _1.address),
      accounts,
      network_id: chainId,
      gasLimit,
      blocktime
    })

    // Apparently there are a lot of listeners.
    if (provider.getMaxListeners() === 10) {
      provider.setMaxListeners(35)
    }

    return { provider, accounts, close: null }
  }
}

/**
 * @param {object} options
 * @param {number} options.accounts Number of accounts to generate.
 * @param {string} options.root Contract's root for `web3.require` so `solc` compiler knows where to look for `.sol` files.
 * @param {string} options.allowPaths Set to '../,' to allow `import "../Foo.sol"` etc.
 * @param {solc} options.solc Alternative to root, pass `solc` compiler directly.
 *
 * @return {object} { web3: Web3, accounts: array, provider }
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

  let provider, accounts, close

  const optionsProvider = get(options, 'provider', DEFAULT_PROVIDER)

  // Pass provider as is if it's not a string.
  if (!isString(optionsProvider)) {
    provider = optionsProvider
  } else {
    const result = providers[optionsProvider](options)
    provider = result.provider
    accounts = result.accounts
    close = result.close
  }

  const web3 = new Web3(provider)

  // Decorate with `require`.
  const root = get(options, 'root')
  const solc = get(options, 'solc')
  const allowPaths = get(options, 'allowPaths')
  assert(!web3.require, 'Can\'t overwrite web3.require.')
  web3.require = makeWeb3Require({ root, solc, allowPaths })

  // Decorate with `deploy`.
  assert(!web3.deploy, 'Can\'t overwrite web3.deploy.')
  web3.deploy = web3Deploy

  // Decorate with `at`.
  assert(!web3.at, 'Can\'t overwrite web3.at.')
  web3.at = web3At

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
