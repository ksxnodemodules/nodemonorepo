import {iter} from '../../../../../index'
import urge = iter.fns.urge

const iterable = 'abcdefghijklmno'
const getArray = (fn?: urge.RemainingHandler<string>) => Array.from(urge(iterable, 4, fn))

it('keep remaining part', () => {
  const array = getArray(urge.KEEP_REMAINING_PART)
  expect(array).toEqual(getArray()) // default parameter
  expect(array).toMatchSnapshot()
  expect(array.length).toBe(4)
  expect(array[3]).toEqual([...'mno'])
})

it('omit remaining part', () => {
  const array = getArray(urge.OMIT_REMAINING_PART)
  expect(array).toMatchSnapshot()
  expect(array.length).toBe(3)
})
