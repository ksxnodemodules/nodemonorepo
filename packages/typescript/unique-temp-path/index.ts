import { join } from 'path'
import { tmpdir } from 'os'
import { readdirSync } from 'fs'

const CONTAINER = tmpdir()

function prvTempPath (prefix: string, suffix: string, existingNames = readdirSync(CONTAINER)): string {
  const basename = [
    prefix,
    Math.random().toString(36).slice(2),
    Date.now().toString(36),
    suffix
  ].join('')

  return existingNames.includes(basename)
    ? prvTempPath(prefix, suffix, existingNames)
    : join(CONTAINER, basename)
}

export const tempPath = (prefix = 'tmp.', suffix = '') => prvTempPath(prefix, suffix)
export const getContainer = () => CONTAINER
export default tempPath
