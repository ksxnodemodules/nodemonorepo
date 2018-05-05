import * as types from '../types'

export function name (pkg: types.Package.ListItem): string {
  return pkg.manifestContent.name || name.anonymous
}

export namespace name {
  export const anonymous = '[anonymous]'
}
