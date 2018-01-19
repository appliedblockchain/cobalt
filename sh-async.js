
const { exec } = require('child_process')

/**
 * Execute simple shell command (async wrapper).
 *
 * @param {string} cmd
 * @return {{ stdout: string, stderr: string }}
 */
async function shAsync(cmd) {
  return new Promise(function (resolve, reject) {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(err)
      } else {
        resolve({ stdout, stderr })
      }
    })
  })
}

module.exports = shAsync
