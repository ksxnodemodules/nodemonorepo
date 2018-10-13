import createArrayEqual from '../index'

it('calls injected function', () => {
  const track = Array<[string, string, string]>()

  const elementEqual = (a: number, b: number, fn: any) => {
    track.push([typeof a, typeof b, typeof fn])
    return a === b
  }

  const arrayEqual = createArrayEqual<number[]>(elementEqual)
  arrayEqual([0, 1], [0, 1])
  arrayEqual([2, 2], [2, 1])

  expect(track).not.toEqual([])
  expect(track).toMatchSnapshot()
})

it('passes arrayEqual to elementEqual as third argument', () => {
  const arrayEqual = createArrayEqual<number[]>((a, b, fn) => {
    expect(fn).toBe(arrayEqual)
    return a === b
  })

  arrayEqual([0, 1, 2], [0, 1, 2])
})

it('uses Object.is as elementEqual by default', () => {
  const track = Array<[any, any]>()
  const originalObjectIs = Object.is
  const spy = jest.spyOn(Object, 'is').mockImplementation((a, b) => {
    track.push([a, b])
    return originalObjectIs(a, b)
  })

  const arrayEqual = createArrayEqual()

  const ref = {}
  const sym = Symbol()

  const received = {
    equal: arrayEqual([ref, sym, NaN, 0], [ref, sym, NaN, 0]),
    notEqual: arrayEqual([0], ['0'])
  }

  const expected = {
    equal: true,
    notEqual: false
  }

  spy.mockRestore()

  expect(track).not.toEqual([])
  expect(track).toMatchSnapshot()
  expect(received).toEqual(expected)
})

it('uses elementEqual results', () => {
  const alwaysTrue = (): true => true
  const alwaysFalse = (): false => false
  const sameString = (a: any, b: any) => String(a) === String(b)
  const tripleEqual = (a: any, b: any) => a === b

  expect({
    alwaysTrue: createArrayEqual(alwaysTrue)(['foo'], ['bar']),
    alwaysFalse: createArrayEqual(alwaysFalse)([0], [0]),
    sameString: createArrayEqual(sameString)([{ toString: () => 'hello' }], ['hello']),
    tripleEqual: createArrayEqual(tripleEqual)([0], ['0'])
  }).toEqual({
    alwaysTrue: true,
    alwaysFalse: false,
    sameString: true,
    tripleEqual: false
  })
})

it('returns false for arrays of different length', () => {
  expect(
    createArrayEqual(() => true)(['a'], ['a', 'b'])
  ).toBe(false)
})
