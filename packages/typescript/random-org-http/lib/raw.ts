import fetch from 'node-fetch'
import {create} from './url'

type UrlMaker<Query> =
  (query: Query) => string

const mkfn =
  <Query>(mkurl: UrlMaker<Query>) =>
    (query: Query) => fetch(mkurl(query))

export const integer = mkfn(create.integer)
export const sequence = mkfn(create.sequence)
export const string = mkfn(create.string)
