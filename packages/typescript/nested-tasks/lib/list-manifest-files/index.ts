import * as path from 'path'
import * as fsTreeUtils from 'fs-tree-utils'

import {
  DeepFunc as PrvDeepFunc,
  TraversalDeepFuncParam
} from 'fs-tree-utils/lib/traverse'

import {
  Manifest
} from '../.types'

/**
 * @param dirname Directory that contains all task manifest descriptors
 * @param options Specify deep function and file chooser
 * @returns A list of task manifests
 */
export async function listManifestFiles (
  dirname: string,
  options: listManifestFiles.Options = {}
): listManifestFiles.Result {
  const {
    deep = listManifestFiles.DEFAULT_DEEP_FUNCTION,
    choose = listManifestFiles.DEFAULT_FILE_CHOOSER
  } = options

  const list = await fsTreeUtils.traverse(dirname, deep)
  const result = Array<Manifest.Descriptor>()

  for (const item of list) {
    const type = choose(item)
    if (!type) continue
    result.push({...item, type})
  }

  return result
}

export namespace listManifestFiles {
  export const DEFAULT_DEEP_FUNCTION: DeepFunc = x => x.item !== 'node_modules'

  export const DEFAULT_FILE_CHOOSER: FileChooser = x => {
    switch (path.extname(x.item)) {
      case '':
      case '.js':
        return 'module'
      case '.json':
      case '.yaml':
      case '.yml':
        return 'yaml'
    }

    return null
  }

  export interface Options {
    readonly deep?: DeepFunc
    readonly choose?: FileChooser
  }

  export type Result = Promise<ReadonlyArray<Manifest.Descriptor>>
  export type DeepFunc = PrvDeepFunc
  export type FileChooser = (param: FileChooser.Param) => Manifest.Type | null | void

  export namespace FileChooser {
    export type Param = TraversalDeepFuncParam
  }
}

export default listManifestFiles
