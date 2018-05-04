import yaml from 'js-yaml'
import * as types from '../.types'
import readFileSync from '../.utils/read-file-sync'

function mkfn (load: types.Function.Loader): types.Function.SyncReader {
  return (source, options) => {
    const data = readFileSync(source, options)

    try {
      return load(data, options)
    } catch (error) {
      if (error instanceof yaml.YAMLException) {
        throw new types.LoadFileError(source, error)
      }

      throw error
    }
  }
}

export const loadFileSync = mkfn(yaml.load)
export const safeLoadFileSync = mkfn(yaml.safeLoad)

export {
  loadFileSync as unsafe,
  safeLoadFileSync as safe
}

export default loadFileSync
