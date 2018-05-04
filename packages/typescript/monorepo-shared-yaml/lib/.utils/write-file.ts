import * as fsx from 'fs-extra'
import * as types from '../.types'

export function writeFile (
  filename: types.FileSystem.Path,
  data: types.FileSystem.WritableData,
  options?: types.FileSystem.WriteOptions
): Promise<void> {
  return fsx.writeFile(String(filename), data, options)
}

export default writeFile
