
const { map, keys, difference } = require('lodash')
const hex0xToHex = require('./hex0x-to-hex')
const bytecodePlaceholders = require('./bytecode-placeholders')
const jsonStringify = require('./json-stringify')

 /**
  * Replace placeholders with provided addresses.
  *
  * @param {string} bytecode Unlinked bytecode.
  * @param {{ [__placeholder__]: address }} Placeholder to address mapping.
  * @return {hex0x} Linked bytecode.
  */
function bytecodeLink(bytecode, links = {}) {

  // Collect keys so we can check if there's one-to-one match.
  const as = keys(links)
  const bs = map(bytecodePlaceholders(bytecode), 'name')

  // Check for extra links provided.
  {
    const diff = difference(as, bs)
    if (diff.length) {
      throw new Error(`Unnecessary extra links provided ${diff.map(jsonStringify).join(', ')}.`)
    }
  }

  // Check for missing links.
  {
    const diff = difference(bs, as)
    if (diff.length) {
      throw new Error(`Missing links for ${diff.map(jsonStringify).join(', ')}. Did you forget to provide those links when deploying?`)
    }
  }

  return keys(links).reduce((r, k) =>
    k.endsWith('___') ?
      r.split(k).join(hex0xToHex(links[k])) :
      r.replace(k, hex0xToHex(links[k]))
  , bytecode)
}

module.exports = bytecodeLink
