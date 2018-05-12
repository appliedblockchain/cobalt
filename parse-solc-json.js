
function parseSolcJson(value) {
  const parsed = JSON.parse(value)
  const r = {}
  for (const [key, { bin, abi }] of Object.entries(parsed.contracts)) {
    r[key.split(':')[1]] = { abi: JSON.parse(abi), bin: bin ? '0x' + bin : null }
  }
  return r
}

module.exports = parseSolcJson
