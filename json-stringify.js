
function jsonStringify(value, pretty = false) {
  return JSON.stringify(value, null, pretty ? 2 : 0)
}

module.exports = jsonStringify
