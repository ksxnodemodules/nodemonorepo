import listManifestFiles from '../list-manifest-files'
import loadManifestDescriptor from '../load-manifest-descriptor'
import {Manifest, TaskSet} from '../.types'

/**
 * @param dirname Directory that contains all task manifest descriptors
 * @param options Specify deep function and file chooser
 * @returns A list of task collections
 */
export async function loadManifestFiles (
  dirname: string,
  options?: loadManifestFiles.Options
): loadManifestFiles.Result {
  const list = await listManifestFiles(dirname, options)
  return loadManifestFiles.fromList(list)
}

export namespace loadManifestFiles {
  /**
   * @param list A list of task manifests
   * @returns A list of task collections
   */
  export async function fromList (list: List): Result {
    return Promise.all(
      list.map(async descriptor => ({
        descriptor,
        tasks: await loadManifestDescriptor(descriptor)
      }))
    )
  }

  export type List = ReadonlyArray<Manifest.Descriptor>

  export type Options = listManifestFiles.Options

  export type Result = Promise<ReadonlyArray<Result.Item>>

  export namespace Result {
    export interface Item {
      readonly descriptor: Manifest.Descriptor
      readonly tasks: TaskSet
    }
  }
}

export default loadManifestFiles
