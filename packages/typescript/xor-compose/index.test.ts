import compose, {Fn} from './index'

namespace fn {
  export const charCodeArray = (str: string) =>
    Array.from(str).map(x => x.charCodeAt(0))

  export const a = (str: string) => charCodeArray(str).reduce((a, b) => a | b)
  export const b = (str: string) => charCodeArray(str).reduce((a, b) => a & b)
  export const c = (str: string) => charCodeArray(str).reduce((a, b) => a ^ b)
  export const d = (str: string) => charCodeArray(str).reduce((a, b) => a + b)

  export const param = 'abcdefABCDEF'

  export const combinations: [string, Fn<string>][] = [
    ['a', compose(a)],
    ['b', compose(b)],
    ['c', compose(c)],
    ['d', compose(d)],
    ['a^b', compose(a, b)],
    ['b^c', compose(b, c)],
    ['c^d', compose(c, d)],
    ['d^a', compose(d, a)],
    ['a^c', compose(a, c)],
    ['b^d', compose(b, d)],
    ['a^b^c', compose(a, b, c)],
    ['a^b^d', compose(a, b, d)],
    ['a^c^d', compose(a, c, d)],
    ['b^c^d', compose(b, c, d)],
    ['a^b^c^d', compose(a, b, c, d)]
  ]
}

it('single composition should act like its sole provided function', () => {
  const call = (name: string) => {
    const res = fn.combinations.find(([x]) => x === name)
    return res ? res[1](fn.param) : undefined
  }

  expect({
    a: call('a'),
    b: call('b'),
    c: call('c'),
    d: call('d')
  }).toStrictEqual({
    a: fn.a(fn.param),
    b: fn.b(fn.param),
    c: fn.c(fn.param),
    d: fn.d(fn.param)
  })
})

it('matches snapshot', () => {
  const result = fn.combinations.map(
    ([name, func]) => ({name, result: func(fn.param)})
  )

  expect(result).toMatchSnapshot()
})
