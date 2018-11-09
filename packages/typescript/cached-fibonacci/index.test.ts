import CachedFibonacci from './index'

it('returns correct result', () => {
  const { calculate } = new CachedFibonacci()

  expect(
    [0, 1, 2, 3, 4, 5, 6, 7, 8].map(calculate)
  ).toEqual(
    [0, 1, 1, 2, 3, 5, 8, 13, 21]
  )
})

describe('cache does not affect final result', () => {
  const mkfn = (...args: number[]) => () => {
    const { calculate } = new CachedFibonacci()
    expect(args.map(calculate)).toEqual(args.map(x => new CachedFibonacci().calculate(x)))
  }

  it('0, 1, 2, 3, 4', mkfn(0, 1, 2, 3, 4))
  it('4, 3, 2, 1, 0', mkfn(4, 3, 2, 1, 0))
  it('5, 7, 3', mkfn(5, 7, 3))
})
