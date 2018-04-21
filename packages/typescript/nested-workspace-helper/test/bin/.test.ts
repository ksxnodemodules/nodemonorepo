import {SpawnSyncOptions} from 'child_process'
import * as xjest from 'extra-jest'
import spawn from './lib/spawn'

const snap = x => xjest.snap.unsafe(x)()

const snapSpawn = (argv?: string[], options?: SpawnSyncOptions) =>
  () => snap(spawn(argv, options))

describe('help message', () => {
  describe('from global command', () => {
    it('with --help', snapSpawn(['--help']))
    it('without arguments', snapSpawn())
  })

  describe('from version-management', () => {
    it('as version-management', snapSpawn(['version-management']))
    it('as verman', snapSpawn(['verman']))
  })

  it('from version-management/mismatches', snapSpawn(['version-management', 'mismatches']))
})
