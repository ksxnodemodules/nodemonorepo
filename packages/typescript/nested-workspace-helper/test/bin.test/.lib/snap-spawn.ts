import {SpawnSyncOptions} from 'child_process'
import ramda from 'ramda'
import * as xjest from 'extra-jest'
import spawn from './spawn'

export {spawn}

export const snap = (x: any) => xjest.snap.unsafe(x)()

export function snapSpawn (argv?: string[], options?: SpawnSyncOptions) {
  return () => snap(spawn(argv, options))
}

export namespace snapSpawn {
  export const promise = (argv?: string[], options?: SpawnSyncOptions) =>
    ramda.pipe(snapSpawn(argv, options), async <X>(x: X) => x)
}

export default snapSpawn
