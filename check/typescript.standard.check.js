'use strict'
const path = require('path')
const main = require('./lib/test-spawn')
const project = path.resolve(__dirname, '..')

test('TypeScript: TSLint', () => {
  main({
    defaultExecutable: 'tslint',
    argvPrefix: ['--project', project],
    envMiddleName: 'STANDARDJS'
  })
})
