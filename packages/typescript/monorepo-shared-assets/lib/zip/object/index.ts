import * as types from '../../.types'

export type Dict<X> = Readonly<types.Dict.StrKey<X>>

export function zip<A, B> (
  a: Dict<A>,
  b: Dict<B>,
  provideKeys: zip.KeySetProvider = zip.FIRST
): Dict<[A | void, B | void]> {
  const akeys = Object.keys(a)
  const bkeys = Object.keys(b)
  const keys = provideKeys(akeys, bkeys)

  const result: types.Dict.StrKey<[A | void, B | void]> = {}

  for (const name of keys) {
    result[name] = [a[name], b[name]]
  }

  return result
}

export namespace zip {
  export type KeySetProvider = (a: string[], b: string[]) => Iterable<string>

  export const FIRST: KeySetProvider = a => a

  export const INNER_JOIN: KeySetProvider = (a, b) =>
    a.length < b.length ? b.filter(x => a.includes(x)) : a.filter(x => b.includes(x))

  export const OUTER_JOIN: KeySetProvider = (a, b) => new Set(a.concat(b))
}

export default zip
