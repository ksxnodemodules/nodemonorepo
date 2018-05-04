import yaml from 'js-yaml'
import * as types from '../.types'
import writeFileSync from '../.utils/write-file-sync'

function mkfn (dump: types.Function.Dumper): types.Function.SyncWriter {
  return (data, target, options) => writeFileSync(target, dump(data, options), options)
}

export const dumpFileSync = mkfn(yaml.dump)
export const safeDumpFileSync = mkfn(yaml.safeDump)

export {
  dumpFileSync as unsafe,
  safeDumpFileSync as safe
}

export default dumpFileSync
