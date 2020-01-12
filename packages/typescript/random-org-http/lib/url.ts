import qstr from 'querystring'
import { Generator, QueryObject, raw } from './types'

export const origin = 'https://random.org'

export namespace create {
  const base =
    <X>(type: Generator, query: QueryObject<X>) =>
      `${origin}/${type}/?${qstr.stringify(query as any, '&', '=')}`

  const mkfn =
    <Param extends raw.Param>(type: Generator) =>
      (query: Param) => base(type, query)

  export const integers = mkfn<raw.Param.Integer>(Generator.integers)
  export const sequences = mkfn<raw.Param.Sequence>(Generator.sequences)
  export const strings = mkfn<raw.Param.String>(Generator.strings)
}
