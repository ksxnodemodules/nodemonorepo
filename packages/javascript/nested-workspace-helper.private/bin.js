#! /usr/bin/env preloaded-node
'use strict'

const process = require('process')
const { spawnSync } = require('preloaded-node.private')
const bin = require.resolve('nested-workspace-helper/bin/nested-wrkspc')

const { status } = spawnSync(
  [bin, ...process.argv.slice(2)],
  {
    stdio: 'inherit',
    shell: true
  }
)

process.exit(status)
