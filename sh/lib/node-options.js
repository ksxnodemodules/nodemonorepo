'use strict'
const path = require('path')
const fs = require('fs')
const {env} = require('process')
const warningFile = path.resolve(__dirname, '../../node-warnings.log')
const redirectWarnings = `--redirect-warnings=${warningFile}`

const message = [
  '--throw-deprecation',
  '--trace-warnings',
  redirectWarnings,
  env.NODE_OPTIONS
]
  .filter(Boolean)
  .join(' ')

console.info(message)

fs.existsSync(warningFile) && fs.unlinkSync(warningFile)
