import { enumerate } from 'iter-tools'
import { AlteredEqual } from '../../index'

it('calls injected function', () => {
  const track = Array<[typeof act, number, number]>()
  let act: 'set' | 'delete' | 'get' | 'has'

  const equal = (a: number, b: number) => {
    track.push([act, a, b])
    return a === b
  }

  const map = new AlteredEqual<number, string>(Map, equal)

  act = 'set'
  map.set(0, 'zero').set(1, 'one').set(2, 'two')

  act = 'get'
  ; [0, 1, 2, 3].map(x => map.get(x))

  act = 'has'
  ; [0, 1, 2, 3].map(x => map.has(x))

  act = 'delete'
  ; [0, 1, 2, 3].map(x => map.delete(x))

  expect(track).not.toEqual([])
  expect(track).toMatchSnapshot()
})

it('set() works as intended', () => {
  const key = Symbol()
  const map = new AlteredEqual(Map)

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
  const map = new AlteredEqual(Map)
  const entries = Array.from(enumerate(['zero', 'one', 'two']))

  for (const [key, value] of entries) {
    map.set(key, value)
  }

  expect(
    entries.map(x => map.get(x[0]))
  ).toEqual(
    entries.map(x => x[1])
  )
})

it('delete() works as intended', () => {
  const key = Symbol()
  const map = new AlteredEqual(Map)

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
  const map = new AlteredEqual(Map)
    .set(0, 'zero')
    .set(1, 'one')

  expect({
    0: map.has(0),
    1: map.has(1),
    2: map.has(2),
    3: map.has(3)
  }).toEqual({
    0: true,
    1: true,
    2: false,
    3: false
  })
})

it('find() works as intended', () => {
  const map = new AlteredEqual<number, string>(Map)
    .set(0, 'zero')
    .set(1, 'one')

  type FindingResult = AlteredEqual.Find.Result<number, string>

  const FOUND = (key: number, value: string): FindingResult =>
    ({ found: true, value: { key, value } })

  const NOT_FOUND: FindingResult = { found: false }

  expect({
    0: map.find(0),
    1: map.find(1),
    2: map.find(2),
    3: map.find(3)
  }).toEqual({
    0: FOUND(0, 'zero'),
    1: FOUND(1, 'one'),
    2: NOT_FOUND,
    3: NOT_FOUND
  })
})
