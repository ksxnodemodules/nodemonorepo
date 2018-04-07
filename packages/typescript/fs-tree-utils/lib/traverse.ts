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
export type TraversalResult = TraversalResultItem[]
export type AsyncTraversalResult = Promise<TraversalResult>

export async function traverse (
  dirname: string,
  deep: DeepFunc = () => true,
  level = 0
): AsyncTraversalResult {
  const dirChildren = await fsx.readdir(dirname)
  let result: TraversalResult = []

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

export default Object.assign(
  traverse,
  {
    async: traverse
  }
)
