import {iter} from '../../../../../index'
import range = iter.fns.range
import split = iter.fns.split

describe('split by function', () => {
  const choose = (x: number) => x % 5 === 0
  const getArray = (x: number) => Array.from(split.func(range(1).up.to(x), choose))
  const getDefaultArray = (x: number) => Array.from(split(range(1).up.to(x), choose))

  it('when tail is not empty', () => {
    expect(getArray(18)).toMatchSnapshot()
    expect(getArray(18)).toEqual(getDefaultArray(18)) // default
  })

  it('when tail is empty', () => {
    expect(getArray(16)).toMatchSnapshot()
    expect(getArray(16)).toEqual(getDefaultArray(16)) // default
  })
})

describe('split by line', () => {
  const iterable = [0, null, 1, 2, null, 3, 4, 5, null, 6, 7, 8, 9]
  const line = null

  const getArray = (compare?: split.line.Comparator<any>) =>
    Array.from(split.line(iterable, line, compare))

  it('using default comparator', () => {
    expect(getArray()).toMatchSnapshot()
  })

  it('using custom comparator', () => {
    expect(getArray((a, b) => a === b)).toMatchSnapshot()
  })
})
