import * as fsTreeUtils from 'fs-tree-utils'
import {snapSpawn} from './snap-spawn'

import {
  snapFileSystem,
  unchangedFileSystem,
  snapAndUnchanged,
  Factory
} from './filesystem'

export type Executor = (dirname?: string, ...argv: string[]) => () => Promise<void>

export function spawn (dirname = '.', ...argv: string[]) {
  return snapFileSystem(dirname, snapSpawn.promise(argv))
}

export namespace spawn {
  export function unchanged (dirname = '.', ...argv: string[]) {
    return unchangedFileSystem(dirname, snapSpawn.promise(argv))
  }

  export namespace unchanged {
    export function snap (dirname = '.', ...argv: string[]) {
      return snapAndUnchanged(dirname, snapSpawn.promise(argv))
    }
  }
}

export default spawn
