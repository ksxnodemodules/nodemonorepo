import * as path from 'path'
import * as fsx from 'fs-extra'
import {Tree} from './types'

/**
 * Create a directory tree
 * @param tree Tree structure that needs to create
 * @param container Where to place the tree
 */
export async function create (tree: Tree, container: string = '') {
  if (typeof tree === 'string') {
    await fsx.writeFile(container, tree)
    return
  }

  if (fsx.existsSync(container)) {
    const stats = await fsx.stat(container)
    if (!stats.isDirectory()) {
      throw new Error(`Entity ${container} exists but is not directory`)
    }
  } else {
    await fsx.mkdir(container)
  }

  await Promise.all(
    Object
      .entries(tree)
      .map(([key, val]): [string, Tree] => [path.join(container, key), val])
      .map(([newContainer, newTree]) => create(newTree, newContainer))
  )
}

export namespace create {
  export const async = create
}

export default create
