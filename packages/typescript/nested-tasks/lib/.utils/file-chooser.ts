import * as path from 'path'
import getManifestType from './manifest-type'

import {
  TraversalDeepFuncParam
} from 'fs-tree-utils/lib/traverse'

import {
  Manifest
} from '../.types'

export function createFileChooser (
  prefix: string
): createFileChooser.FileChooser {
  return x => {
    const {base, ext} = path.parse(x.item)
    return base === prefix ? getManifestType(ext) : null
  }
}

export namespace createFileChooser {
  export interface FileChooser {
    (param: FileChooser.Param): FileChooser.Result
  }

  export namespace FileChooser {
    export type Param = TraversalDeepFuncParam
    export type Result = Manifest.Type | null
  }
}

export default createFileChooser
