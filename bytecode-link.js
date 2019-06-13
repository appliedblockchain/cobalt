// @flow

const keys = require('lodash/keys')
const difference = require('lodash/difference')
const bytecodePlaceholders = require('./bytecode-placeholders')
const jsonStringify = require('./json-stringify')
const placeholderOfString = require('./placeholder-of-string')

/**
  * Replace placeholders with provided addresses.
  *
  * @param {string} bytecode Unlinked bytecode.
  * @param addressesOfPaths Mapping from file paths to ethereum addresses.
  * @returns linked bytecode.
  */
function bytecodeLink(bytecode /*: string */, addressesOfPaths /*: { [string]: string } */ = {}) /*: string */ {

  // Construct mapping from placeholder to path and address.
  const links = keys(addressesOfPaths)
    .map(path => ({ path, placeholder: placeholderOfString(path), address: addressesOfPaths[path] }))
    .reduce((_, { path, placeholder, address }) => ({ ..._, [placeholder]: { path, address } }), {})

  const placeholders = bytecodePlaceholders(bytecode)

  // Collect keys so we can check if there's one-to-one match.
  const as = keys(links)
  const bs = keys(placeholders)

  const abDiff = difference(as, bs)
  const baDiff = difference(bs, as)

  if (abDiff.length || baDiff.length) {
    throw new Error([
      abDiff.length ? `Unnecessary extra links provided ${abDiff.map(jsonStringify).join(', ')}.` : null,
      baDiff.length ? `Missing links for ${baDiff.map(jsonStringify).join(', ')}. Did you forget to provide those links when deploying?` : null
    ].filter(Boolean).join(' '))
  }

  return keys(placeholders)
    .reduce((_, placeholder) => _.split(placeholder).join(links[placeholder].address.slice(2)), bytecode)
}

module.exports = bytecodeLink
