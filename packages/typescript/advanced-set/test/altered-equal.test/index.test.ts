import { AlteredEqual } from '../../index'

it('calls injected function', () => {
  const track = Array<[typeof act, number, number]>()
  let act: 'has' | 'add' | 'delete'

  const equal = (a: number, b: number): boolean => {
    track.push([act, a, b])
    return a === b
  }

  const set = new AlteredEqual<number>(Set, equal)

  act = 'add'
  set.add(0)
  set.add(1)

  act = 'has'
  ; [0, 1, 2, 3].map(x => set.has(x))

  act = 'delete'
  ; [0, 1, 2, 3].map(x => set.delete(x))

  expect(track).not.toEqual([])
  expect(track).toMatchSnapshot()
})

it('add() works as intended', () => {
  const element = Symbol()
  const set = new AlteredEqual(Set)

  const before = set.has(element)
  set.add(element)
  const after = set.has(element)

  expect({
    before,
    after
  }).toEqual({
    before: false,
    after: true
  })
})

it('has() works as intended', () => {
  const set = new AlteredEqual(Set)
  set.add(0)
  set.add(1)

  const expected = [true, true, false, false]
  const received = [0, 1, 2, 3].map(x => set.has(x))
  expect(received).toEqual(expected)
})

it('delete() works as intended', () => {
  const element = Symbol()
  const set = new AlteredEqual(Set)

  const before = set.has(element)
  set.add(element)
  const between = set.has(element)
  set.delete(element)
  const after = set.has(element)

  expect({
    before,
    between,
    after
  }).toEqual({
    before: false,
    between: true,
    after: false
  })
})

it('find() works as intended', () => {
  const set = new AlteredEqual<number>(Set)
  set.add(0)
  set.add(1)

  type FindingResult = AlteredEqual.Find.Result<number>
  const FOUND = (value: number): FindingResult => ({ found: true, value })
  const NOT_FOUND: FindingResult = { found: false }

  expect({
    0: set.find(0),
    1: set.find(1),
    2: set.find(2),
    3: set.find(3)
  }).toEqual({
    0: FOUND(0),
    1: FOUND(1),
    2: NOT_FOUND,
    3: NOT_FOUND
  })
})
