
const sprintf = require('sprintf-js')

function puts(...args) {
  console.log(sprintf(...args))
}

module.exports = puts
