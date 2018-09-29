import * as types from '../.types'

/**
 * Create a directory tree
 * @param tree Tree structure that needs to create
 * @param container Where to place the tree
 */
export async function create (
  tree: types.Tree.Write,
  container: string
): Promise<void> {
  const { FileSystemRepresentation } = types

  if (typeof tree === 'string' || tree instanceof Buffer) {
    return create(new FileSystemRepresentation.File(tree), container)
  }

  if (typeof tree === 'function') {
    return tree(container, { create })
  }

  if (tree instanceof FileSystemRepresentation) {
    return create(x => tree.write(x, { create }), container)
  }

  return create(new FileSystemRepresentation.Directory(tree), container)
}

export namespace create {
  export const async = create
}

export default create
