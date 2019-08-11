export * from './types'
export * from './constants'
export * from './functions'

// workaround a stupid bug during test:
//   TypeError: Cannot read property 'Semver' of undefined
//
//     4 |
//     5 | const samples: ReadonlyArray<Sample> = [
//   > 6 |   [Type.Semver, [
//       |         ^
//     7 |     '0.1.2',
//     8 |     '=0.1.2',
//     9 |     '~0.1.2',
//
//   at Object.<anonymous> (packages/typescript/parse-dependency-range/test/lib.test/functions.test/parse.test/index.test.ts:6:9)
export { Type } from './types'
