import url from 'url'
import semver from 'semver'
import { array } from 'convenient-typescript-utilities'
import { Struct, Type, GitUrl, LocalUrl, TarballUrl } from '../../types'
import { GITHUB_SHORTHAND, GIT_URL, LOCAL_URL, TARBALL_URL } from '../../constants'
const { includes } = array

function parse (value: string): Struct {
  if (value === 'latest') {
    return {
      type: Type.Latest,
      value
    }
  }

  const range: string | null = semver.validRange(value)
  if (range) {
    return {
      type: Type.Semver,
      value,
      range
    }
  }

  if (GITHUB_SHORTHAND.test(value)) {
    const [org, ...orgRest] = value.split('/')
    const [repo, ...repoRest] = orgRest.join('/').split('#')
    const hash = repoRest.join('#') || undefined

    return {
      type: Type.GitHub,
      value,
      org,
      repo,
      hash
    }
  }

  const urlObject = url.parse(value)
  const { protocol } = urlObject

  if (includes(GIT_URL.PROTOCOL, protocol)) {
    return {
      type: Type.Git,
      value,
      url: urlObject as GitUrl
    }
  }

  if (includes(LOCAL_URL.PROTOCOL, protocol)) {
    return {
      type: Type.Local,
      value,
      path: value.split(':').slice(1).join(':'),
      protocol: protocol as LocalUrl.Protocol
    }
  }

  if (includes(TARBALL_URL.PROTOCOL, protocol)) {
    const extension: TarballUrl.Extension | undefined =
      TARBALL_URL.EXTENSION.find(ext => value.endsWith(ext))

    if (extension) {
      return {
        type: Type.Tarball,
        value,
        url: {
          ...urlObject,
          extension
        } as TarballUrl
      }
    }
  }

  return {
    type: Type.Unknown,
    value
  }
}

export = parse
