import { iter } from '../../../../../index'
const { repeat } = iter.fns

const assert = <A, B>(a: Iterable<A>, b: Iterable<B>) =>
  expect(Array.from(a)).toEqual(Array.from(b))

it('repeat function for iterable works', () => {
  assert(repeat('abc', 5), [...'abc'.repeat(5)])
})

it('repeat function for element works', () => {
  assert(repeat.element(12, 5), [12, 12, 12, 12, 12])
})
