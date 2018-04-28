import range from '../../../../../lib/iter/fns/range'

type Iter = Iterable<number>

const assert = (a: Iter, b: Iter) =>
  expect(Array.from(a)).toEqual(Array.from(b))

describe('with begin and end', () => {
  it('from -3 to +3', () => assert(range(-3).up.to(3), [-3, -2, -1, 0, 1, 2]))
  it('from +3 to -3', () => assert(range(3).down.to(-3), [3, 2, 1, 0, -1, -2]))
  it('to +3 from -3', () => assert(range(3).up.from(-3), [-3, -2, -1, 0, 1, 2]))
  it('to -3 from +3', () => assert(range(-3).down.from(3), [3, 2, 1, 0, -1, -2]))
})

describe('without either begin or end', () => {
  it('from -3 to undefined', () => assert(range(-3).up.to(), [-3, -2, -1]))
  it('from +3 to undefined', () => assert(range(3).down.to(), [3, 2, 1]))
  it('to +3 from undefined', () => assert(range(3).up.from(), [0, 1, 2]))
  it('to -3 from undefined', () => assert(range(-3).down.from(), [0, -1, -2]))
})

describe('is iterable', () => {
  it('range(5)', () => assert(range(5), [0, 1, 2, 3, 4]))
  it('range(5).up', () => assert(range(5).up, [0, 1, 2, 3, 4]))
  it('range(5).down', () => assert(range(5).down, [5, 4, 3, 2, 1]))
})
