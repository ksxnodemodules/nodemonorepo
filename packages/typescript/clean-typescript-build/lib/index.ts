import path from 'path'
import {partition} from 'ramda'
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

/**
 * Delete all compiled products corresponding to source files inside `root`
 * @param root Directory that contains all source files
 * @param options Options
 * @param options.deep A function that tells when to go deeper
 * @param options.isSource A function that tells which file is a source file
 * @param options.listTargets A function that lists compiled products corresponding to a source file
 * @returns An object
 *   * Property `targets`: An aggregation of `options.listTargets`'s return values
 *   * Property `reports`: An array of reports which tell whether or not deletion succeed
 *   * Property `success`: An array of paths to files which are successfully deleted
 *   * Property `failure`: An array of paths to files which are failed to be deleted
 */
export async function clean (root: string, options?: Options): Promise<clean.Result> {
  const del = (file: string) => unlink(file).then(onUnlinkSuccess, onUnlinkFailure)
  const r2f = (reports: clean.Result.ReportList) => reports.map(x => x.file)
  const onUnlinkSuccess = () => ({success: true as true})
  const onUnlinkFailure = (error: any) => ({success: false as false, error})
  const targets = await listAllTargets(root, options)
  const reports = await Promise.all(targets.map(async file => ({file, deletion: await del(file)})))
  const [success, failure] = partition(x => x.deletion.success, reports)
  return {targets, reports, success: r2f(success), failure: r2f(failure)}
}

export namespace clean {
  export interface Result {
    readonly targets: Result.FileList
    readonly reports: Result.ReportList
    readonly success: Result.FileList
    readonly failure: Result.FileList
  }

  export namespace Result {
    export type FileList = ReadonlyArray<string>
    export type ReportList = ReadonlyArray<Report>

    export interface Report {
      readonly file: string
      readonly deletion: Report.Deletion
    }

    export namespace Report {
      export type Deletion = Deletion.Success | Deletion.Failure

      export namespace Deletion {
        export interface Success {
          readonly success: true
        }

        export interface Failure {
          readonly success: false
          readonly error: any
        }
      }
    }
  }
}

/**
 * List compiled products corresponding to source files inside `root`
 * @param root Directory that contains all source files
 * @param options Options
 * @param options.deep A function that tells when to go deeper
 * @param options.isSource A function that tells which file is a source file
 * @param options.listTargets A function that lists compiled products corresponding to a source file
 * @returns A promise that resolves a list of target file paths
 */
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

export default clean
