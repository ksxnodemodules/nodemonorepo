const bin = require.resolve('./bin')

const spawn = (...args) =>
  require('child_process').spawn(bin, ...args)

const spawnSync = (...args) =>
  require('child_process').spawnSync(bin, ...args)

module.exports = {
  bin,
  spawn,
  spawnSync
}
