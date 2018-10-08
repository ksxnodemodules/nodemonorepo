import { MultiKey } from '../../index'

it('calls injected function on key member', () => {
  const types = Array<[typeof act, string, string]>()
  let act: 'has' | 'get' | 'set'

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

  expect(types).toMatchSnapshot()
})

it('get() works as intended', () => {
  const map = new MultiKey<[number, number], string>(Map)
  map.set([0, 0], 'a')
  map.set([1, 1], 'b')

  expect({
    '00': map.get([0, 0]),
    '11': map.get([1, 1]),
    '01': map.get([0, 1]),
    '10': map.get([1, 0])
  }).toEqual({
    '00': 'a',
    '11': 'b',
    '01': undefined,
    '10': undefined
  })
})

it('has() works as intended', () => {
  const map = new MultiKey<[number, number], string>(Map)
  map.set([0, 0], 'a')
  map.set([1, 1], 'b')

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
