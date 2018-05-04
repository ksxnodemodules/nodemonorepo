import * as yaml from 'js-yaml'
import * as lib from './lib'
import * as types from './lib/.types'

export {
  yaml,
  lib,
  types
}

export default {
  ...yaml,
  ...lib
}
