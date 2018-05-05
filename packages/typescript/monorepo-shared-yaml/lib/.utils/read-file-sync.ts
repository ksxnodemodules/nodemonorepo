import * as fs from 'fs'
import * as types from '../.types'

export function readFileSync (
  filename: types.FileSystem.Path,
  options: types.FileSystem.ReadOptions = 'utf8'
): string {
  return fs.readFileSync(filename, options)
}

export default readFileSync
