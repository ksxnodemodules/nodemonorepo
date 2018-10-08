import { enumerate } from 'iter-tools'
import { AlteredEqual } from '../../index'

it('calls injected function', () => {
  const track = Array<[typeof act, number, number]>()
  let act: 'set' | 'get' | 'has'

  const equal = (a: number, b: number) => {
    track.push([act, a, b])
    return a === b
  }

  const map = new AlteredEqual<number, string>(Map, equal)

  act = 'set'
  map.set(0, 'zero')
  map.set(1, 'one')
  map.set(2, 'two')

  act = 'get'
  ; [0, 1, 2, 3].map(x => map.get(x))

  act = 'has'
  ; [0, 1, 2, 3].map(x => map.has(x))

  expect(track).not.toEqual([])
  expect(track).toMatchSnapshot()
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

it('has() works as intended', () => {
  const map = new AlteredEqual(Map)
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
