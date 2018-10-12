import { MutableMultiKey } from '../../index'

it('calls injected function on key member', () => {
  const types = Array<[typeof act, string, string]>()
  let act: 'has' | 'get' | 'delete' | 'set'

  const equal = (a: number, b: number) => {
    types.push([act, typeof a, typeof b])
    return a === b
  }

  const map = new MutableMultiKey<[number, number], string>(Map, equal)

  act = 'set'
  map.set([0, 0], 'a')
  map.set([0, 1], 'b')
  map.set([1, 0], 'c')
  map.set([1, 1], 'd')

  act = 'get'
  map.get([0, 0])
  map.get([2, 3])

  act = 'has'
  map.has([0, 0])
  map.has([2, 3])

  act = 'delete'
  map.delete([1, 1])
  map.delete([2, 3])

  expect(types).toMatchSnapshot()
})

it('set() works as intended', () => {
  const key = [0, 1, 2]
  const map = new MutableMultiKey(Map)

  const before = map.get(key)
  map.set(key, 0)
  const setToZero = map.get(key)
  map.set(key, 1)
  const setToOne = map.get(key)

  expect({
    before,
    setToZero,
    setToOne
  }).toEqual({
    before: undefined,
    setToZero: 0,
    setToOne: 1
  })
})

it('get() works as intended', () => {
  const map = new MutableMultiKey<number[], string>(Map)
  map.set([0, 0], 'a')
  map.set([1, 1], 'b')
  map.set([-1], 'c')

  expect({
    '-1': map.get([-1]),
    '00': map.get([0, 0]),
    '11': map.get([1, 1]),
    '01': map.get([0, 1]),
    '10': map.get([1, 0])
  }).toEqual({
    '-1': 'c',
    '00': 'a',
    '11': 'b',
    '01': undefined,
    '10': undefined
  })
})

it('delete() works as intended', () => {
  const key = [0, 1, 2]
  const map = new MutableMultiKey(Map)

  const whenKeyDoesNotExist = map.delete(key)
  map.set(key, 'exist')
  const afterSet = map.get(key)
  const whenKeyExist = map.delete(key)
  const afterDelete = map.get(key)

  expect({
    whenKeyDoesNotExist,
    afterSet,
    whenKeyExist,
    afterDelete
  }).toEqual({
    whenKeyDoesNotExist: false,
    afterSet: 'exist',
    whenKeyExist: true,
    afterDelete: undefined
  })
})

it('has() works as intended', () => {
  const map = new MutableMultiKey<[] | [number, number], string>(Map)
  map.set([0, 0], 'a')
  map.set([1, 1], 'b')
  map.set([], 'c')

  expect({
    '00': map.has([0, 0]),
    '11': map.has([1, 1]),
    '01': map.has([0, 1]),
    '10': map.has([1, 0])
  }).toEqual({
    '00': true,
    '11': true,
    '01': false,
    '10': false
  })
})

it('keys are mutable', () => {
  const map = new MutableMultiKey<number[], string>(Map)

  const getValues = () => ({
    0: map.get([0]),
    1: map.get([1]),
    k: map.get(key)
  })

  const defined = 'defined'
  const key = [0]
  map.set(key, defined)
  const before = getValues()
  key[0] = 1
  const after = getValues()

  expect({
    before,
    after
  }).toEqual({
    before: {
      0: defined,
      1: undefined,
      k: defined
    },
    after: {
      0: undefined,
      1: defined,
      k: defined
    }
  })
})
