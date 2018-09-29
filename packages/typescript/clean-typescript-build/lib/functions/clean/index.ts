import { partition } from 'ramda'
import { unlink } from 'fs-extra'
import { Options, Clean } from '../../types'
import listAllTargets from '../list-all-targets'

export = clean

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
async function clean (root: string, options?: Options): Promise<Clean.Result> {
  const del = (file: string) => unlink(file).then(onUnlinkSuccess, onUnlinkFailure)
  const r2f = (reports: Clean.Result.ReportList) => reports.map(x => x.file)
  const onUnlinkSuccess = () => ({ success: true as true })
  const onUnlinkFailure = (error: any) => ({ success: false as false, error })
  const targets = await listAllTargets(root, options)
  const reports = await Promise.all(targets.map(async file => ({ file, deletion: await del(file) })))
  const [success, failure] = partition(x => x.deletion.success, reports)
  return { targets, reports, success: r2f(success), failure: r2f(failure) }
}
