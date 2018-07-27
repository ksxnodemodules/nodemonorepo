import qstr from 'querystring'
import {Generator, QueryObject, raw} from './types'

export const origin = 'https://random.org'

export namespace create {
  const base =
    <X>(type: Generator, query: QueryObject<X>) =>
      `${origin}/${type}/?${qstr.stringify(query, '&', '=')}`

  const mkfn =
    <Param extends raw.Param>(type: Generator) =>
      (query: Param) => base(type, query)

  export const integer = mkfn<raw.Param.Integer>(Generator.integer)
  export const sequence = mkfn<raw.Param.Sequence>(Generator.sequence)
  export const string = mkfn<raw.Param.String>(Generator.string)
}
