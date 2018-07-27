import * as types from './lib/types'
import * as url from './lib/url'
import * as raw from './lib/raw'
import * as structured from './lib/structured'

import Param = types.structured.Param

export const {
  integer,
  string,
  sequence
} = structured

export {
  types,
  url,
  raw,
  structured,
  Param
}
