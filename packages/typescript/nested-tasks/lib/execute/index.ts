import {Task, TaskSet} from '../.types'
import loadManifestFiles from '../load-manifest-files'

/**
 *
 * @param dirname Directory that contains all task file
 * @param taskpath Dot separated task names
 * @param options Options to pass to `loadManifestFiles`
 */
export async function execute (
  dirname: string,
  taskpath: string,
  options?: execute.Options
) {
  return execute.fromList(
    await loadManifestFiles(dirname, options),
    taskpath.split('.')
  )
}

export namespace execute {
  export async function fromList (
    tasklist: ReadonlyArray<loadManifestFiles.Result.Item>,
    taskpath: ReadonlyArray<string>
  ) {}

  export type Options = loadManifestFiles.Options
}

export default execute
