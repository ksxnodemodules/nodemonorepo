import {WriteTree} from './types'
import FileSystemRepresentation from './classes/fs-representation'
const {File, Directory} = FileSystemRepresentation

/**
 * Create a directory tree
 * @param tree Tree structure that needs to create
 * @param container Where to place the tree
 */
export async function create (tree: WriteTree, container: string = ''): Promise<void> {
  if (typeof tree === 'string') {
    return create(new File(tree), container)
  }

  if (typeof tree === 'function') {
    return tree(container)
  }

  if (tree instanceof FileSystemRepresentation) {
    return create(x => tree.write(x), container)
  }

  return create(new Directory(tree), container)
}

export namespace create {
  export const async = create
}

export default create
