import path from 'path'
import {unlink, lstat, existsSync} from 'fs-extra'
import {traverse, Traverse} from 'fs-tree-utils'

export type TargetList = ReadonlyArray<string>
export type DeepFunc = Traverse.Options.DeepFunc
export type Param = Traverse.Options.DeepFunc.Param
export type SourceDetector = (x: Param) => boolean
export type TargetSpecifier = (x: Param) => TargetList

export interface Options {
  readonly deep?: DeepFunc
  readonly isSource?: SourceDetector
  readonly listTargets?: TargetSpecifier
}

export const DEFAULT_DEEP_FUNC: DeepFunc =
  x => x.item !== 'node_modules'

export const DEFAULT_SOURCE_DETECTOR: SourceDetector =
  ({item}) => /\.tsx?/.test(item) && !/\.d.tsx?/.test(item)

export const DEFAULT_TARGET_SPECIFIER: TargetSpecifier = specifyTarget

export async function clean (root: string, options?: Options) {
  const targets = await listAllTargets(root, options)
  await Promise.all(targets.map(x => unlink(x)))
  return targets
}

export async function listAllTargets (
  root: string,
  options: Options = {}
): Promise<TargetList> {
  const {
    deep = DEFAULT_DEEP_FUNC,
    isSource = DEFAULT_SOURCE_DETECTOR,
    listTargets = DEFAULT_TARGET_SPECIFIER
  } = options

  const existed = (await traverse(root, {deep, stat: lstat}))
    .filter(isSource)
    .map(listTargets)
    .reduce((prev, current) => [...prev, ...current], [])
    .filter(item => existsSync(item))

  const files = (await Promise.all(
    existed.map(async item => ({
      item,
      stats: await lstat(item)
    }))
  ))
    .filter(x => x.stats.isFile())
    .map(x => x.item)

  return files
}

function specifyTarget ({item, container}: Param) {
  const {name} = path.parse(item)

  return [
    '.js',
    '.js.map',
    '.jsx',
    '.jsx.map',
    '.d.ts',
    '.d.ts.map',
    '.d.tsx',
    '.d.tsx.map'
  ]
    .map(suffix => path.join(container, name + suffix))
}
