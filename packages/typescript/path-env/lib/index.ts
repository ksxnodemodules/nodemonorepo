import {env} from 'process'
import * as base from './path-env'
import * as types from './types'

export * from './types'

export const pathString = (string = env.PATH || '', delim?: types.PathDelimiter) =>
  base.pathString(string, delim)

export const pathEnv = (envObject: types.Env = env, name?: string, delim?: types.PathDelimiter) =>
  base.pathEnv(envObject, name, delim)

export {base, types}
