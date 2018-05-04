import {
  DumpOptions,
  LoadOptions,
  YAMLException
} from 'js-yaml'

export namespace Function {
  export type Loader = (data: string, options?: LoadOptions) => any
  export type Dumper = (data: any, options?: DumpOptions) => string
  export type AsyncReader = (source: FileSystem.Path, options?: Options.LoadRead) => Promise<any>
  export type AsyncWriter = (data: any, target: FileSystem.Path, options?: Options.DumpWrite) => Promise<void>
  export type SyncReader = (source: FileSystem.Path, options?: Options.LoadRead) => any
  export type SyncWriter = (data: any, target: FileSystem.Path, options?: Options.DumpWrite) => void
}

export namespace FileSystem {
  export interface ReadObjectOptions {
    readonly encoding: Encoding
    readonly flag?: Flag
  }

  export interface WriteObjectOptions {
    readonly encoding?: Encoding | null
    readonly flag?: Flag
    readonly mode?: number
  }

  export type Encoding = BufferEncoding
  export type Flag = 'a' | 'ax' | 'a+' | 'ax+' | 'as' | 'r' | 'r+' | 'rs+'
  export type ReadOptions = Encoding | ReadObjectOptions
  export type WriteOptions = WriteObjectOptions
  export type Path = string | Buffer
  export type WritableData = Buffer | string
}

export namespace Options {
  export type LoadYaml = LoadOptions
  export type DumpYaml = DumpOptions
  export type ReadFile = FileSystem.ReadOptions
  export type WriteFile = FileSystem.WriteOptions
  export type LoadRead = LoadYaml & FileSystem.ReadObjectOptions
  export type DumpWrite = DumpYaml & FileSystem.WriteObjectOptions
}

export class LoadFileError extends Error {
  readonly filename: FileSystem.Path
  readonly yamlException: YAMLException

  constructor (filename: FileSystem.Path, yamlException: YAMLException) {
    super(`Failed to parse '${filename}': ${yamlException.message}`)
    this.filename = filename
    this.yamlException = yamlException
  }
}
