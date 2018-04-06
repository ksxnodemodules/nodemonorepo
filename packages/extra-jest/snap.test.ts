import * as snap from './snap'

const refA = {}
const refB = {refA}
const refC = [refA, refB]
const refs = {refA, refB, refC, a: refA, b: refB, c: refC}

const unsafePattern = {
  primaries: {
    numbers: {
      integer: 123,
      float: 45.6,
      infinity: Infinity,
      zero: 0,
      nan: NaN
    },
    string: 'Hello, World!!',
    nothingness: {
      null: null,
      undefined: undefined
    }
  },
  references: {
    refs,
    object: {
      abc: 123,
      def: 456
    },
    array: [
      [...'abcdef'],
      [123, 456, 789]
    ],
    function: () => 'Hello, World!!'
  }
}

const safePattern = {
  primaries: {
    numbers: {
      integer: 123,
      float: 45.6,
      infinity: Infinity,
      zero: 0,
      nan: NaN
    },
    string: 'Hello, World!!',
    nothingness: {
      null: null
    }
  },
  references: {
    refs,
    object: {
      abc: 123,
      def: 456
    },
    array: [
      [...'abcdef'],
      [123, 456, 789]
    ]
  }
}

describe('snap.unsafe', () => {
  it('works', snap.unsafe(unsafePattern))
})

describe('snap.safe', () => {
  it('works', snap.safe(safePattern))
})

describe('snap.pureUnsafe', () => {
  it('works', snap.pureUnsafe(unsafePattern))
})

describe('snap.pureSafe', () => {
  it('works', snap.pureSafe(safePattern))
})

describe('snap.noRefs', () => {
  it('works', snap.noRefs(unsafePattern))
})
