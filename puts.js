
const sprintf = require('sprintf')

function puts(...args) {
  console.log(sprintf(...args))
}

module.exports = puts
