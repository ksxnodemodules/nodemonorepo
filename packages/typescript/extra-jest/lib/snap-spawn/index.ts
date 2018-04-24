import {SpawnSyncOptions} from 'child_process'
import ramda from 'ramda'
import prln from 'preloaded-node'
import * as xsnap from '../snap'
import spawn, {SpawnFunc} from './lib/spawn'

export * from './lib/spawn'

export function snap (
  fn: SpawnFunc,
  argv?: string[],
  options?: SpawnSyncOptions,
  snap = xsnap.safe
) {
  return snap(spawn(fn, argv, options))
}

export namespace snap {
  export const curried = ramda.curry(snap)
  export const preloadedNode = curried(prln.spawnSync)
}

export default snap
