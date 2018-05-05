import * as fs from 'fs'
import * as types from '../.types'

export function writeFileSync (
  filename: types.FileSystem.Path,
  data: types.FileSystem.WritableData,
  options?: types.FileSystem.WriteOptions
): void {
  fs.writeFileSync(filename, data, options)
}

export default writeFileSync
