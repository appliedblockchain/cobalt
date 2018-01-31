
/**
 * Returns ordinal number as `1st`, `2nd` etc. string.
 *
 * @param {number} value
 * @return {string}
 */
function ith(value) {
  const ones = value % 10
  const tens = Math.floor(value / 10) % 10
  if (tens === 1) {
    return `${value}th`
  }
  switch (ones) {
    case 1: return `${value}st`
    case 2: return `${value}nd`
    case 3: return `${value}rd`
  }
  return `${value}th`
}

module.exports = ith
