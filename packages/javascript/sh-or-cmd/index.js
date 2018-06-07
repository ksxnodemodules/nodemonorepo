const platform = require('os').platform()

const get = ({win32 = 'cmd', posix = 'sh'} = {}) =>
  platform === 'win32' ? win32 : posix

Object.assign(exports, {
  platform,
  get,
  default: get()
})
