import {SpawnSyncOptions} from 'child_process'
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

export default snap
