import {SpawnSyncOptions} from 'child_process'
import * as xjest from 'extra-jest'
import spawn from './spawn'

export {spawn}

export const snap = (x: any) => xjest.snap.unsafe(x)()

export const snapSpawn = (argv?: string[], options?: SpawnSyncOptions) =>
  () => snap(spawn(argv, options))

export default snapSpawn
