// @flow

const placeholderOfString = require('../placeholder-of-string')

test('placeholderOfString', () => {
  expect(placeholderOfString('Library.sol:Library')).toEqual('__$d350073c68faf3b499efe87de0a25a404f$__')
})
