'use strict'
const path = require('path')
const fs = require('fs')
const process = require('process')
const glob = require('glob')

process.chdir(path.resolve(__dirname, '..'))
console.info('Cleaning TypeScript build products...')
const files = glob.sync('packages/typescript/**/*.{js,d.ts,js.map}', {dot: true})

for (const x of files) {
  if (/node_modules/.test(x)) continue
  if (/\.inrepo/.test(x)) continue
  console.info('  --> Deleting', x)
  fs.unlink(x, error => error && console.error(`Failed to delete ${x}`, {error}))
}
