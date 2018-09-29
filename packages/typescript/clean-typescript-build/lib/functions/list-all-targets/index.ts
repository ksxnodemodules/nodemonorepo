import { existsSync, lstat } from 'fs-extra'
import { traverse } from 'fs-tree-utils'
import { Options, TargetList } from '../../types'
import { DEFAULT_DEEP_FUNC, DEFAULT_SOURCE_DETECTOR, DEFAULT_TARGET_SPECIFIER } from '../../contants'

export = listAllTargets

/**
 * List compiled products corresponding to source files inside `root`
 * @param root Directory that contains all source files
 * @param options Options
 * @param options.deep A function that tells when to go deeper
 * @param options.isSource A function that tells which file is a source file
 * @param options.listTargets A function that lists compiled products corresponding to a source file
 * @returns A promise that resolves a list of target file paths
 */
async function listAllTargets (
  root: string,
  options: Options = {}
): Promise<TargetList> {
  const {
    deep = DEFAULT_DEEP_FUNC,
    isSource = DEFAULT_SOURCE_DETECTOR,
    listTargets = DEFAULT_TARGET_SPECIFIER
  } = options

  const existed = (await traverse(root, { deep, stat: lstat }))
    .filter(isSource)
    .map(listTargets)
    .reduce((prev, current) => [...prev, ...current], [])
    .filter(item => existsSync(item))

  const files = (await Promise.all(
    existed.map(async item => ({
      item,
      stats: await lstat(item)
    }))
  ))
    .filter(x => x.stats.isFile())
    .map(x => x.item)

  return files
}
