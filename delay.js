
function delay(seconds = 1) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000))
}

module.exports = delay
