import yaml from 'js-yaml'
import * as types from '../.types'
import readFile from '../.utils/read-file'

function mkfn (load: types.Function.Loader): types.Function.AsyncReader {
  return async (source, options) => {
    const data = await readFile(source, options)

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

export const loadFile = mkfn(yaml.load)
export const safeLoadFile = mkfn(yaml.safeLoad)

export {
  loadFile as unsafe,
  safeLoadFile as safe
}

export default loadFile
