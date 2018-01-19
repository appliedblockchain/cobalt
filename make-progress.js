
const sprintf = require('sprintf')
const Progress = require('progress')

/**
 * Usage:
 *
 *   const progress = makeProgress('foo', 100)
 *   progress.tick()
 *
 * @param {string} name
 * @param {number} total
 * @return {Progress}
 */
function makeProgress(name, total) {
  return new Progress(sprintf('%20s [:bar] :percent :current/:total :rate/s :etas', name), {
    total, width: 20, incomplete: ' ', renderThrottle: 1000 / 12, clear: true
  })
}

module.exports = makeProgress
