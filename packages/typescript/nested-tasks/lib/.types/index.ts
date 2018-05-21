import {
  TraversalDeepFuncParam
} from 'fs-tree-utils/lib/traverse'

export namespace Manifest {
  export interface Descriptor extends TraversalDeepFuncParam {
    readonly type: Type
  }

  export type Type = 'module' | 'yaml'
}
