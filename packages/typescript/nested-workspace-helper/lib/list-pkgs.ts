import * as fsx from 'fs-extra'
import * as fsTreeUtils from 'fs-tree-utils'
import {TraversalResultItem} from 'fs-tree-utils/lib/traverse'
import {PackageList, PackageListItem} from './types'

export type ListPackageResult = Promise<PackageList>

export async function listAllPackages (dirname: string): ListPackageResult {
  const createItem = async (x: TraversalResultItem): Promise<PackageListItem> =>
    ({path: x.container, manifestFile: x.path, manifestContent: await fsx.readJSON(x.path)})

  return await Promise.all(
    (
      await fsTreeUtils.traverse(dirname, x => !/node_modules/.test(x.item))
    )
      .filter(x => x.item === 'package.json')
      .filter(x => x.stats.isFile())
      .map(createItem)
  )
}

export default listAllPackages
