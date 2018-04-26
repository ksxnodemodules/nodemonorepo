import * as path from 'path'
import * as fsx from 'fs-extra'

export type TraversalDeepFuncParam = {
  container: string,
  item: string,
  path: string,
  stats: fsx.Stats,
  level: number
}
export type DeepFunc = (x: TraversalDeepFuncParam) => boolean
export type DepsDict = {
  [packageName: string]: string
}
export type TraversalResultItem = TraversalDeepFuncParam
export type TraversalResult = ReadonlyArray<TraversalResultItem>
export type AsyncTraversalResult = Promise<TraversalResult>

/**
 * @param dirname Top directory
 * @param deep When to dive deeper
 * @param level Initial level of dept
 * @returns Array of traversed files/directories
 */
export async function traverse (
  dirname: string,
  deep: DeepFunc = () => true,
  level = 0
): AsyncTraversalResult {
  const dirChildren = await fsx.readdir(dirname)
  const result: TraversalResultItem[] = []

  for (const item of dirChildren) {
    const itemPath = path.join(dirname, item)
    const stats = fsx.statSync(itemPath)
    const itemResult = {
      item,
      stats,
      level,
      container: dirname,
      path: itemPath
    }
    result.push(itemResult)

    const shouldGoDeeper = stats.isDirectory() && deep(itemResult)
    if (shouldGoDeeper) {
      result.push(...await traverse(itemPath, deep, level + 1))
    }
  }

  return result
}

export namespace traverse {
  export const async = traverse
}

export default traverse
