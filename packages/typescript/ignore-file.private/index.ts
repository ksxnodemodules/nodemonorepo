import * as path from 'path'
import * as yaml from 'js-yaml'
import * as fsx from 'fs-extra'
import * as fsTreeUtils from 'fs-tree-utils'

export type IgnoreArray = string[]
export type StringTester = string
export type LoadedDeltaFileList = LoadedDeltaFileListElement[]

export interface IgnoreDelta {
  readonly prepend?: IgnoreArray
  readonly append?: IgnoreArray
  readonly remove?: IgnoreArray
}

export interface LoadedDeltaFileListElement {
  readonly filename: string
  readonly content: IgnoreDelta
}

export function getArray (string: string): IgnoreArray {
  return string
    .split(/\n|\r/)
    .filter(Boolean)
    .filter(x => !/^#/.test(x))
}

export function getString (array: IgnoreArray): string {
  return array.join('\n')
}

export function add (
  array: IgnoreArray,
  {
    prepend = [],
    append = [],
    remove = []
  }: IgnoreDelta
): IgnoreArray {
  return [
    ...prepend,
    ...array,
    ...append
  ].filter(
    name => !remove.includes(name)
  )
}

export async function getDeltaFiles (dirname: string, test: StringTester) {
  return (
    await fsTreeUtils.traverse(
      dirname,
      param => param.item !== 'node_modules'
    )
  )
    .filter(x => testString(test, x.item) && x.stats.isFile())
    .map(x => x.path)
}

export async function readDeltaFiles (
  dirname: string,
  test: StringTester
): Promise<LoadedDeltaFileList> {
  const list = await getDeltaFiles(dirname, test)

  return await Promise.all(
    list.map(async filename => ({
      filename,
      content: yaml.safeLoad(await fsx.readFile(filename, 'utf8')) as IgnoreDelta
    }))
  )
}

export async function writeIgnoreFiles (
  base: string,
  container: string,
  delta: string,
  filename = defaultFileName
) {
  const [baseArray, list]: [IgnoreArray, LoadedDeltaFileList] = await Promise.all([
    fsx.readFile(base, 'utf8').then(getArray),
    readDeltaFiles(container, delta)
  ])

  await Promise.all(
    list.map(item => fsx.writeFile(
      filename(item.filename),
      getString(add(baseArray, item.content))
    ))
  )
}

function testString (test: StringTester, subject: string): boolean {
  return test === subject
}

function defaultFileName (deltapath: string) {
  const {root, dir, name, ext} = path.parse(deltapath)
  const basename = name + (ext ? '' : '.txt')
  return path.join(root, dir, basename)
}
