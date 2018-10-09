import Inspectable from './lib/inspectable'

it('calls injected function once for each uninitialized key', () => {
  const track = Array<number>()

  const init = (key: number): void => {
    track.push(key)
  }

  const map = new Inspectable(Map, init)

  for (const key of [0, 1, 2, 1, 2, 2]) {
    map.get(key)
  }

  expect(track).toEqual([0, 1, 2])
})

it('add results of calling injected function to data', () => {
  const map = new Inspectable(Map, (x: number) => String(x))
  ; [0, 1, 2, 3].forEach(x => map.get(x))
  expect(map.__data).toMatchSnapshot()
})

it('set() works as intended', () => {
  const key = Symbol()
  const map = new Inspectable<symbol, -1 | 0 | 1>(Map, () => -1)

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
    before: -1,
    setToZero: 0,
    setToOne: 1
  })
})

it('get() works as intended', () => {
  const map = new Inspectable(Map, (x: number) => String(x))
  const keys = [0, 1, 2, 3]
  const getValues = () => keys.map(x => map.get(x))

  const empty = getValues()
  map.set(0, 'zero')
  map.set(1, 'one')
  const half = getValues()
  map.set(2, 'two')
  map.set(3, 'three')
  const full = getValues()

  expect({ empty, half, full }).toEqual({
    empty: ['0', '1', '2', '3'],
    half: ['zero', 'one', '2', '3'],
    full: ['zero', 'one', 'two', 'three']
  })
})

it('delete() works as intended', () => {
  const key = Symbol()
  const map = new Inspectable(Map, () => 'not exist')

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
    afterDelete: 'not exist'
  })
})

it('has() works as intended', () => {
  const map = new Inspectable(Map, () => '?')
  map.set(0, 'zero')
  map.set(1, 'one')

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
