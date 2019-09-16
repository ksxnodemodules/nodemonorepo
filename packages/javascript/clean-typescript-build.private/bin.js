#! /usr/bin/env preloaded-node
const path = require('path')
const process = require('process')
const { spawnSync } = require('preloaded-node.private')
const bin = require.resolve('clean-typescript-build/bin/clean-typescript-build')
const directory = path.resolve(__dirname, '../../typescript')

const { status } = spawnSync(
  [bin, directory, ...process.argv.slice(2)],
  {
    stdio: 'inherit',
    shell: true
  }
)

process.exit(status)
