import fetch from 'node-fetch'
import { create } from './url'

type UrlMaker<Query> =
  (query: Query) => string

const mkfn =
  <Query>(mkurl: UrlMaker<Query>) =>
    (query: Query) => fetch(mkurl(query))

export const integers = mkfn(create.integers)
export const sequences = mkfn(create.sequences)
export const strings = mkfn(create.strings)
