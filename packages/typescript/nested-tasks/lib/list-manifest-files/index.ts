import * as fsTreeUtils from 'fs-tree-utils'
import createFileChooser from '../.utils/file-chooser'
import TraversalOptions = fsTreeUtils.Traverse.Options

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
    choose = listManifestFiles.DEFAULT_FILE_CHOOSER,
    ...rest
  } = options

  const list = await fsTreeUtils.traverse(dirname, {deep, ...rest})
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
  export const DEFAULT_FILE_CHOOSER = createFileChooser('task')

  export interface Options extends TraversalOptions {
    readonly choose?: FileChooser
  }

  export type Result = Promise<ReadonlyArray<Manifest.Descriptor>>
  export type FileChooser = createFileChooser.FileChooser
  export type DeepFunc = TraversalOptions.DeepFunc
  export type StatFunc = TraversalOptions.StatFunc
  export type Level = TraversalOptions.Level
}

export default listManifestFiles
