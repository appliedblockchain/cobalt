
const { execSync } = require('child_process')
const { Writable } = require('stream')

/**
 * Execute simple shell command (sync).
 *
 * @param {string} cmd
 * @return {object} { stdout: string, stderr: string }
 */
function shSync(cmd) {
  let stderr = ''
  const stdout = execSync(cmd, {
    stderr: (new Writable()).on('data', _1 => stderr += _1),
    encoding: 'utf8'
  })
  return { stdout, stderr }
}

module.exports = shSync
