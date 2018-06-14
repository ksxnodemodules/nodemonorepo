import * as path from 'path'
import ramda from 'ramda'
import * as fsx from 'fs-extra'
import * as assets from 'monorepo-shared-assets'
import traverse from '../traverse'
import {Tree, NestedReadOptions, Traverse, FileSystemRepresentation} from '../.types'
import wrapRejection = assets.wrapException.wrapPromiseRejection
import Symlink = FileSystemRepresentation.Symlink

export type NestedReadResult<Error, Unknown> = Promise<Tree.Read<Error, Unknown>>

export interface FlatReadResultFileContent {
  readonly [filename: string]: Tree.Read.FileContent
}

interface WritableFlatReadResultFileContent {
  [filename: string]: Tree.Read.FileContent
}

export interface FlatReadResultValue {
  readonly fileContents: FlatReadResultFileContent
  readonly directories: ReadonlyArray<string>
  readonly files: ReadonlyArray<string>
  readonly all: ReadonlyArray<string>
}

export type FlatReadResult = Promise<FlatReadResultValue>

/**
 * @param name Directory name
 * @param options Specify stat method and error handler
 * @param options.onerror Specify error transformer
 * @param options.stat Specify stat function
 * @returns Nested directory tree representation
 */
export async function readNested<Error = never, Unknown = never> (
  name: string,
  options: NestedReadOptions<Error, Unknown> = {}
): NestedReadResult<Error, Unknown> {
  const {
    onunknown,
    onerror: transformError,
    stat = (x: string) => fsx.stat(x)
  } = options

  return wrapRejection(main, transformError)(name)

  async function main (name: string): NestedReadResult<Error, Unknown> {
    const stats = await Promise.resolve(stat(name))

    if (stats.isFile()) {
      return await fsx.readFile(name, 'utf8')
    }

    if (stats.isDirectory()) {
      let tree: Tree.Read<Error, Unknown> = {}
      for (const item of await fsx.readdir(name)) {
        const subtree = await main(path.join(name, item))
        tree[item] = subtree
      }
      return tree
    }

    if (stats.isSymbolicLink()) {
      return new Symlink(await fsx.readlink(name))
    }

    if (onunknown) {
      return onunknown({name, stats})
    }

    throw new Error(`Unknown filesystem type of path '${name}'`)
  }
}

/**
 * @param name Directory name
 * @param options Options to pass to `traverse`
 * @returns List of files, directories and file contents
 */
export async function readFlat (name: string, options?: Traverse.Options): FlatReadResult {
  const array = await traverse(name, options)
  const [fileList, dirList] = ramda.partition(x => x.stats.isFile(), array)

  const map = await Promise.all(
    fileList.map(
      (x): [string, Promise<string>] =>
        [x.path, fsx.readFile(x.path, 'utf8')]
    )
  )

  let fileContents: WritableFlatReadResultFileContent = {}
  for (const [name, promise] of map) {
    fileContents[name] = await promise
  }

  return (() => {
    const directories = dirList.map(x => x.path)
    const files = fileList.map(x => x.path)
    const all = [...directories, ...files].sort((a, b) => a < b ? -1 : 1)

    return {
      fileContents,
      directories,
      files,
      all
    }
  })()
}

function addAsyncProperty<X> (x: X) {
  return Object.assign(x, {async: x})
}

export default {
  nested: addAsyncProperty(readNested),
  flat: addAsyncProperty(readFlat)
}
