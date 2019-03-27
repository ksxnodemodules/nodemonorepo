require('../json5')

const { compilerOptions } = require('../../../../../packages/typescript/tsconfig.json5')

require('ts-node').register({
  typeCheck: false,
  transpileOnly: true,
  compilerOptions: {
    ...compilerOptions,
    noUnusedLocals: false,
    noUnusedParameters: false
  }
})
