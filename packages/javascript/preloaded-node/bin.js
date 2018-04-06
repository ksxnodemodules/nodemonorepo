#! /usr/bin/env node
const {argv} = require('process')
const {spawnSync} = require('child_process')
const receivedArgv = argv.slice(2)
const preloadedArgv = ['--require', 'ts-node/register/type-check']
const finalArgv = [...preloadedArgv, ...receivedArgv]

spawnSync(
  'node',
  finalArgv,
  {
    stdio: 'inherit'
  }
)
