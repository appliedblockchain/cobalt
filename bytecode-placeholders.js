
const assert = require('assert')
const { isString, sumBy } = require('lodash')

function bytecodePlaceholders(value) {
  assert(isString(value) && value.startsWith('0x'), 'Expected hex0x-like bytecode (string starging with 0x).')
  const re = /__.{36}__/g
  let p
  const ps = []
  while ((p = re.exec(value))) {
    ps.push({ name: p[0], index: p.index })
  }
  ps.forEach(p => p.ambiguous = sumBy(ps, _1 => _1.name === p.name ? 1 : 0) > 1)
  return ps
}

module.exports = bytecodePlaceholders
