
const fs = require('fs')
const { isString } = require('lodash')

function isDirSync(value) {
  if (!isString(value)) {
    return false
  }
  return fs.lstatSync(value).isDirectory()
}

module.exports = isDirSync
