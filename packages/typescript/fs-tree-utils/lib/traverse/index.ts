import * as path from 'path'
import * as fsx from 'fs-extra'
import {Traverse} from '../.types'

/**
 * @param dirname Top directory
 * @param options
 * @param options.deep When to dive deeper
 * @param options.level Initial level of depth
 * @returns Array of traversed files/directories
 */
export function traverse (
  dirname: string,
  options: Traverse.Options = {}
): Traverse.Result {
  const {
    deep = () => true,
    level = 0,
    stat = (x: string) => fsx.stat(x)
  } = options

  return main(dirname, deep, stat, level)
}

async function main (
  dirname: string,
  deep: Traverse.Options.DeepFunc,
  stat: Traverse.Options.StatFunc,
  level: Traverse.Options.Level
): Traverse.Result {
  const dirChildren = await fsx.readdir(dirname)
  const result = Array<Traverse.Result.Item>()

  for (const item of dirChildren) {
    const itemPath = path.join(dirname, item)
    const stats = await Promise.resolve(stat(itemPath))
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
      result.push(...await main(dirname, deep, stat, level))
    }
  }

  return result
}

export default traverse
