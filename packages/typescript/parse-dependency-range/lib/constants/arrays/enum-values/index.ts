import * as types from '../../../types'

const values = <
  Object extends {[key: string]: any},
  Key extends keyof Object
>(object: Object): ReadonlyArray<Object[Key]> =>
  Object.freeze(Object.values(object))

export const TYPE = values(types.Type)

export namespace TARBALL_URL {
  export const PROTOCOL = values(types.TarballUrl.Protocol)
  export const EXTENSION = values(types.TarballUrl.Extension)
}

export namespace GIT_URL {
  export const PROTOCOL = values(types.GitUrl.Protocol)
}

export namespace LOCAL_URL {
  export const PROTOCOL = values(types.LocalUrl.Protocol)
}
