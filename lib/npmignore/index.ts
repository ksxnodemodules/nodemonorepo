import {resolve} from 'path'
import {readFileSync} from 'fs'

export const rootArray = readFileSync(resolve(__dirname, '../../.npmignore'), 'utf8')
  .split(/\n|\r/)
  .filter(Boolean)
  .filter(x => !/^#/.test(x))

export const rootString = rootArray.join('\n')
