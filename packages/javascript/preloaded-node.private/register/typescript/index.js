require('ts-node').register({
  typeCheck: true,
  compilerOptions: {
    target: 'es2017',
    module: 'commonjs',
    esModuleInterop: true,
    strict: true,
    lib: [
      'es2017',
      'es2018',
      'esnext'
    ]
  }
})
