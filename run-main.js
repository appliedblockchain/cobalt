
const { isFunction, get } = require('lodash')
const isPromise = require('./is-promise')

function noop(result) {
  return result
}

function onError(err) {
  console.error(get(err, 'stack', err))
}

function runMain(main, { args = process.argv, beforeExit = noop } = {}) {

  if (!isFunction(main)) {
    throw new TypeError('Expected main to be a function.')
  }

  const result = main(args)
  if (isPromise(result)) {
    result
      .then(beforeExit)
      .catch(onError)
  }

}

module.exports = runMain
