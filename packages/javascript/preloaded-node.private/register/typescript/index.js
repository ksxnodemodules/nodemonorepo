require('../json5')

const {compilerOptions} = require('../../../../../tsconfig.json5')

require('ts-node').register({
  typeCheck: true,
  compilerOptions
})
