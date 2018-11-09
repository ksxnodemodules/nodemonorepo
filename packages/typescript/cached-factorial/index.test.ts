import CachedFactorial from './index'

it('returns correct result', () => {
  const { calculate } = new CachedFactorial()

  expect(
    [3, 5, 4, 7].map(x => [x, calculate(x)])
  ).toEqual([
    [3, 6],
    [5, 120],
    [4, 24],
    [7, 5040]
  ])
})

describe('cache does not affect final result', () => {
  const mkfn = (...args: number[]) => () => {
    const { calculate } = new CachedFactorial()
    expect(args.map(calculate)).toEqual(args.map(x => new CachedFactorial().calculate(x)))
  }

  it('0, 1, 2, 3, 4', mkfn(0, 1, 2, 3, 4))
  it('4, 3, 2, 1, 0', mkfn(4, 3, 2, 1, 0))
  it('5, 7, 3', mkfn(5, 7, 3))
})
