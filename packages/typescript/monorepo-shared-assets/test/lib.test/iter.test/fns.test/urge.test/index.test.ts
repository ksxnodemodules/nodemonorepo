import {iter} from '../../../../../index'
import fns = iter.fns
import range = fns.range
import urge = fns.urge

const PART_LENGTH = 4
const PART_COUNT = 5
const REMAIN_LENGTH = 3
const withRemaining = Array.from(range(PART_LENGTH * PART_COUNT + REMAIN_LENGTH))
const withoutRemaining = Array.from(range(PART_LENGTH * PART_COUNT))

const getArray = (
  iterable: Iterable<number>,
  fn?: urge.RemainingHandler<number>
) => Array.from(urge(iterable, 4, fn))

describe('omit only empty remaining part', () => {
  it('when some elements remain', () => {
    const array = getArray(withRemaining, urge.OMIT_EMPTY_REMAINING_PART)
    expect(array).toEqual(getArray(withRemaining)) // default parameter
    expect(array).toMatchSnapshot()
    expect(array.length).toBe(PART_COUNT + 1)
    expect(array[PART_COUNT].length).toBe(REMAIN_LENGTH)
  })

  it('when no elements remain', () => {
    const array = getArray(withoutRemaining, urge.OMIT_EMPTY_REMAINING_PART)
    expect(array).toEqual(getArray(withoutRemaining)) // default parameter
    expect(array).toMatchSnapshot()
    expect(array.length).toBe(PART_COUNT)
  })
})

describe('keep remaining part', () => {
  it('when some elements remain', () => {
    const array = getArray(withRemaining, urge.KEEP_REMAINING_PART)
    expect(array).toMatchSnapshot()
    expect(array.length).toBe(PART_COUNT + 1)
    expect(array[PART_COUNT].length).toBe(REMAIN_LENGTH)
  })

  it('when no elements remain', () => {
    const array = getArray(withoutRemaining, urge.KEEP_REMAINING_PART)
    expect(array).toMatchSnapshot()
    expect(array.length).toBe(PART_COUNT + 1)
    expect(array[PART_COUNT]).toEqual([])
  })
})

it('omit remaining part', () => {
  const array = getArray(withRemaining, urge.OMIT_REMAINING_PART)
  expect(array).toMatchSnapshot()
  expect(array.length).toBe(PART_COUNT)
  expect(array).toEqual(getArray(withoutRemaining, urge.OMIT_REMAINING_PART))
})
