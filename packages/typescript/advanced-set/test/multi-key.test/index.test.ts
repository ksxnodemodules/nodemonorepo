import { MultiKey } from '../../index'

it('calls injected function on array member', () => {
  const types = Array<[typeof act, string, string]>()
  let act: 'has' | 'add' | 'delete'

  const equal = (a: number, b: number): boolean => {
    types.push([act, typeof a, typeof b])
    return a === b
  }

  const set = new MultiKey<[number, number]>(Set, equal)

  act = 'add'
  set.add([0, 0])
  set.add([0, 1])
  set.add([1, 0])
  set.add([1, 1])

  act = 'has'
  set.has([0, 0])
  set.has([2, 3])

  act = 'delete'
  set.delete([0, 0])
  set.delete([2, 3])

  expect(types).toMatchSnapshot()
})

it('add() works as intended', () => {
  const element = [0, 1, 2]
  const set = new MultiKey(Set)

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
  const set = new MultiKey<number[]>(Set)
  set.add([0, 0])
  set.add([0, 1])

  expect({
    '00': set.has([0, 0]),
    '01': set.has([0, 1]),
    '10': set.has([1, 0]),
    '11': set.has([1, 1])
  }).toEqual({
    '00': true,
    '01': true,
    '10': false,
    '11': false
  })
})

it('delete() works as intended', () => {
  const element = [0, 1, 2]
  const set = new MultiKey(Set)

  const whenElementDoesNotExist = set.delete(element)
  set.add(element)
  const afterAdd = set.has(element)
  const whenElementExists = set.delete(element)
  const afterDelete = set.has(element)

  expect({
    whenElementDoesNotExist,
    afterAdd,
    whenElementExists,
    afterDelete
  }).toEqual({
    whenElementDoesNotExist: false,
    afterAdd: true,
    whenElementExists: true,
    afterDelete: false
  })
})

it('elements are immutable', () => {
  const set = new MultiKey<number[]>(Set)
  const getValues = () => [set.has([0]), set.has([1])]

  const element = [0]
  set.add(element)
  const beforeMutation = getValues()
  element[0] = 1
  const afterMutation = getValues()

  expect(beforeMutation).toEqual(afterMutation)
})
