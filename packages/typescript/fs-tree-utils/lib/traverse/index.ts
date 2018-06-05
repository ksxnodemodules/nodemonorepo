import * as path from 'path'
import * as fsx from 'fs-extra'
import {Traverse} from '../.types'

/**
 * @param dirname Top directory
 * @param options
 * @param options.deep When to dive deeper
 * @param options.stat Stat function to use
 * @param options.level Initial level of depth
 * @returns Array of traversed files/directories
 */
export function traverse (
  dirname: string,
  options: Traverse.Options = {}
): Traverse.Result {
  const {
    deep = () => true,
    stat = (x: string) => fsx.stat(x),
    level = 0
  } = options

  return main(dirname, level)

  async function main (
    dirname: string,
    level: Traverse.Options.Level
  ): Traverse.Result {
    const dirChildren = await fsx.readdir(dirname)
    const result = Array<Traverse.Result.Item>()

    const statList = await Promise.all(
      dirChildren.map(async item => {
        const itemPath = path.join(dirname, item)
        const stats = await Promise.resolve(stat(itemPath))
        return {item, itemPath, stats}
      })
    )

    for (const {item, itemPath, stats} of statList) {
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
        result.push(...await main(itemPath, level + 1))
      }
    }

    return result
  }
}

export default traverse
