import {spawn, SpawnOptions} from 'child_process'
import callSpawn from '../core'

export = (command: string, args?: string[], options?: SpawnOptions) =>
  callSpawn(spawn, command, args, options)
