'use strict'
const main = require('./lib/test-spawn')

test('TypeScript: Type Check', () => {
  main({
    defaultExecutable: 'tsc',
    argvPrefix: ['--noEmit'],
    envMiddleName: 'STANDARDJS'
  })
})
