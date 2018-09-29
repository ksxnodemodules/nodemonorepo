import { Url } from 'url'

export type Struct =
  Struct.Semver |
  Struct.Tarball |
  Struct.Git |
  Struct.GitHub |
  Struct.Local |
  Struct.Latest |
  Struct.Unknown

export namespace Struct {
  export namespace utils {
    export interface Base {
      readonly type: Type
      readonly value: string
    }
  }

  export interface Semver extends utils.Base {
    readonly type: Type.Semver
    readonly range: string
  }

  export interface Tarball extends utils.Base {
    readonly type: Type.Tarball
    readonly url: TarballUrl
  }

  export interface Git extends utils.Base {
    readonly type: Type.Git
    readonly url: GitUrl
  }

  export interface GitHub extends utils.Base {
    readonly type: Type.GitHub
    readonly org: string
    readonly repo: string
    readonly hash?: string
  }

  export interface Local extends utils.Base {
    readonly type: Type.Local
    readonly path: string
    readonly protocol: LocalUrl.Protocol
  }

  export interface Latest extends utils.Base {
    readonly type: Type.Latest
    readonly value: 'latest'
  }

  export interface Unknown extends utils.Base {
    readonly type: Type.Unknown
  }
}

export enum Type {
  Semver = 'semver',
  Tarball = 'tarball',
  Git = 'git',
  GitHub = 'github',
  Local = 'local',
  Latest = 'latest',
  Unknown = 'unknown'
}

export interface TarballUrl extends Url {
  readonly protocol: TarballUrl.Protocol
  readonly extension: TarballUrl.Extension
}

export namespace TarballUrl {
  export enum Protocol {
    FTP = 'ftp:',
    FTPS = 'ftps:',
    HTTP = 'http:',
    HTTPS = 'https:'
  }

  export enum Extension {
    Tgz = '.tgz',
    TarGz = '.tar.gz',
    TarGzip = '.tar.gzip'
  }
}

export interface GitUrl extends Url {
  readonly protocol: GitUrl.Protocol
}

export namespace GitUrl {
  export enum Protocol {
    Git = 'git:',
    SSH = 'git+ssh:',
    HTTP = 'git+http:',
    HTTPS = 'git+https:',
    Local = 'git+file:'
  }
}

export namespace LocalUrl {
  export enum Protocol {
    File = 'file:',
    Link = 'link:'
  }
}
