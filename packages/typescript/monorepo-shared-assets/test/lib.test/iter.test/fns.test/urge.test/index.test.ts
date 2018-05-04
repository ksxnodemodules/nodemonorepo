import {iter} from '../../../../../index'
import urge = iter.fns.urge

const withRemaining = 'abcdefghijklmno'
const withoutRemaining = 'abcdefghijkl'

const getArray = (
  iterable: Iterable<string>,
  fn?: urge.RemainingHandler<string>
) => Array.from(urge(iterable, 4, fn))

describe('omit only empty remaining part', () => {
  it('when some elements remain', () => {
    const array = getArray(withRemaining, urge.OMIT_EMPTY_REMAINING_PART)
    expect(array).toEqual(getArray(withRemaining)) // default parameter
    expect(array).toMatchSnapshot()
    expect(array.length).toBe(4)
    expect(array[3]).toEqual([...'mno'])
  })

  it('when no elements remain', () => {
    const array = getArray(withoutRemaining, urge.OMIT_EMPTY_REMAINING_PART)
    expect(array).toEqual(getArray(withoutRemaining)) // default parameter
    expect(array).toMatchSnapshot()
    expect(array.length).toBe(3)
  })
})

describe('keep remaining part', () => {
  it('when some elements remain', () => {
    const array = getArray(withRemaining, urge.KEEP_REMAINING_PART)
    expect(array).toMatchSnapshot()
    expect(array.length).toBe(4)
    expect(array[3]).toEqual([...'mno'])
  })

  it('when no elements remain', () => {
    const array = getArray(withoutRemaining, urge.KEEP_REMAINING_PART)
    expect(array).toMatchSnapshot()
    expect(array.length).toBe(4)
    expect(array[3]).toEqual([])
  })
})

it('omit remaining part', () => {
  const array = getArray(withRemaining, urge.OMIT_REMAINING_PART)
  expect(array).toMatchSnapshot()
  expect(array.length).toBe(3)
  expect(array).toEqual(getArray(withoutRemaining, urge.OMIT_REMAINING_PART))
})
