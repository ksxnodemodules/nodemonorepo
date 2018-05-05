import * as fsx from 'fs-extra'
import * as types from '../.types'

export function readFile (
  filename: types.FileSystem.Path,
  options: types.FileSystem.ReadOptions = 'utf8'
): Promise<string> {
  return fsx.readFile(filename, options as fsx.ReadOptions)
}

export default readFile
