
const { isString } = require('lodash')
const Web3 = require('web3')
const net = require('net')

function makeProvider(url) {

  if (!isString(url)) {
    throw new TypeError(`Expected string url, got ${typeof url}.`)
  }

  if (url.startsWith('ws://') || url.startsWith('wss://')) {
    return new Web3.providers.WebsocketProvider(url)
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return new Web3.providers.HttpProvider(url)
  }

  if (url.endsWith('.ipc')) {
    return new Web3.providers.IpcProvider(url, net)
  }

  throw new Error(`Unable to determine provider for ${url}.`)
}

module.exports = makeProvider
