import * as path from 'path'
import ramda from 'ramda'
import * as fsx from 'fs-extra'
import traverse, {DeepFunc} from './traverse'
import {Tree, TreeObject, FileContent} from './types'

export type NestedReadResult = Promise<Tree>

export type FlatReadResultFileContent = {[filename: string]: FileContent}

export type FlatReadResultValue = {
  fileContents: FlatReadResultFileContent,
  directories: string[],
  files: string[],
  all: string[]
}

export type FlatReadResult = Promise<FlatReadResultValue>

/**
 * @param name Directory name
 * @returns Nested directory tree representation
 */
export async function readNested (name: string): NestedReadResult {
  const stats = await fsx.stat(name)

  if (stats.isFile()) {
    return await fsx.readFile(name, 'utf8')
  }

  if (stats.isDirectory()) {
    let tree: TreeObject = {}
    for (const item of await fsx.readdir(name)) {
      const subtree = await readNested(path.join(name, item))
      tree[item] = subtree
    }
    return tree
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

  let fileContents: FlatReadResultFileContent = {}
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
