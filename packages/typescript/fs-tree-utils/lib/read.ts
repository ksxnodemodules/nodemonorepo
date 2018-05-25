import * as path from 'path'
import ramda from 'ramda'
import * as fsx from 'fs-extra'

import traverse, {DeepFunc} from './traverse'

import {
  ReadTree,
  ReadTreeObject,
  ReadFileContent,
  NestedReadOptions,
  FileSystemRepresentation
} from './types'

import Symlink = FileSystemRepresentation.Symlink

export type NestedReadResult = Promise<ReadTree>

export interface FlatReadResultFileContent {
  readonly [filename: string]: ReadFileContent
}

interface WritableFlatReadResultFileContent {
  [filename: string]: ReadFileContent
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
 * @param options Specify stat method
 * @returns Nested directory tree representation
 */
export async function readNested (
  name: string,
  options: NestedReadOptions = {}
): NestedReadResult {
  const {
    stat = (x: string) => fsx.stat(x)
  } = options

  const stats = await Promise.resolve(stat(name))

  if (stats.isFile()) {
    return await fsx.readFile(name, 'utf8')
  }

  if (stats.isDirectory()) {
    let tree: ReadTreeObject = {}
    for (const item of await fsx.readdir(name)) {
      const subtree = await readNested(path.join(name, item))
      tree[item] = subtree
    }
    return tree
  }

  if (stats.isSymbolicLink()) {
    return new Symlink(await fsx.readlink(name))
  }

  throw new Error(`Unknown filesystem type of path '${name}'`)
}

/**
 * @param name Directory name
 * @param deep When to dive deeper
 * @returns List of files, directories and file contents
 */
export async function readFlat (name: string, deep?: DeepFunc): FlatReadResult {
  const array = await traverse(name, deep)
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
