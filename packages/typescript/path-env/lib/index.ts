import {env} from 'process'
import * as base from './path-env'
import {PathDelimiter, PathFactory, Env, EnvFactory} from './types'

export * from './types'

export const pathString = (string = env.PATH || '', delim?: PathDelimiter) =>
  base.pathString(string, delim)

export const pathEnv = (envObject: Env = env, name?: string, delim?: PathDelimiter) =>
  base.pathEnv(envObject, name, delim)


export {base}
