import chalk from 'chalk'
import * as types from '../../types'
import * as pkgUtils from '../../utils/pkg'

export namespace list {
  export function asString (list: types.Package.List): string {
    return asStringArray(list).join('\n')
  }

  export function asStringArray (list: types.Package.List): string[] {
    return list.map(x => chalk.bold(pkgUtils.name(x)) + chalk.dim(` (${x.path})`))
  }
}
