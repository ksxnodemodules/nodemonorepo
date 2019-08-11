import { object } from 'convenient-typescript-utilities'
import { Type, TarballUrl, GitUrl, LocalUrl } from '../../../types'
const { values } = object

export const TYPE = values(Type)

export namespace TARBALL_URL {
  export const PROTOCOL = values(TarballUrl.Protocol)
  export const EXTENSION = values(TarballUrl.Extension)
}

export namespace GIT_URL {
  export const PROTOCOL = values(GitUrl.Protocol)
}

export namespace LOCAL_URL {
  export const PROTOCOL = values(LocalUrl.Protocol)
}
