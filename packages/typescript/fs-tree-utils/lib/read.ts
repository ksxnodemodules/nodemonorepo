import * as path from 'path'
import * as fsx from 'fs-extra'
import traverse, {DeepFunc} from './traverse'
import {Tree, TreeObject, FileContent} from './types'

export type NestedReadResult = Promise<Tree>
export type FlatReadResultValue = {[filename: string]: FileContent}
export type FlatReadResult = Promise<FlatReadResultValue>

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

export async function readFlat (name: string, deep?: DeepFunc): FlatReadResult {
  const array = await traverse(name, deep)

  const map = await Promise.all(
    array
      .filter(x => x.stats.isFile())
      .map((x): [string, Promise<string>] => [x.path, fsx.readFile(x.path, 'utf8')])
  )

  let result: FlatReadResultValue = {}
  for (const [name, promise] of map) {
    result[name] = await promise
  }
  return result
}

function addAsyncProperty<X> (x: X) {
  return Object.assign(x, {async: x})
}

export default {
  nested: addAsyncProperty(readNested),
  flat: addAsyncProperty(readFlat)
}
