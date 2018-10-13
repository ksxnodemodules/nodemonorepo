import { MultiKey } from '../../index'

it('calls injected function on key member', () => {
  const types = Array<[typeof act, string, string]>()
  let act: 'has' | 'get' | 'delete' | 'set'

  const equal = (a: number, b: number) => {
    types.push([act, typeof a, typeof b])
    return a === b
  }

  const map = new MultiKey<[number, number], string>(Map, equal)

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
  const map = new MultiKey(Map)

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
  const map = new MultiKey<number[], string>(Map)
    .set([0, 0], 'a')
    .set([1, 1], 'b')
    .set([-1], 'c')

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
  const map = new MultiKey(Map)

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
  const map = new MultiKey<[] | [number, number], string>(Map)
    .set([0, 0], 'a')
    .set([1, 1], 'b')
    .set([], 'c')

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

it('keys are immutable', () => {
  const map = new MultiKey<number[], string>(Map)

  const key = [0]
  map.set(key, 'zero')

  key[0] = 1
  map.set(key, 'one')

  expect({
    0: map.get([0]),
    1: map.get([1])
  }).toEqual({
    0: 'zero',
    1: 'one'
  })
})
