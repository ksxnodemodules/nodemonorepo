import yaml from 'js-yaml'
import * as types from '../.types'
import writeFile from '../.utils/write-file'

function mkfn (dump: types.Function.Dumper): types.Function.AsyncWriter {
  return (data, target, options) => writeFile(target, dump(data, options), options)
}

export const dumpFile = mkfn(yaml.dump)
export const safeDumpFile = mkfn(yaml.safeDump)

export {
  dumpFile as unsafe,
  safeDumpFile as safe
}

export default dumpFile
