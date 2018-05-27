import * as path from 'path'
import {Stats} from 'fs'
import * as fsx from 'fs-extra'
import create from '../create'

export type Tree = Tree.Read

export namespace Tree {
  export type Read = Read.Node

  export namespace Read {
    export type Node =
      FileContent |
      Object |
      FileSystemRepresentation.Symlink |
      FileSystemRepresentation.Exception

    export type FileContent = string

    export interface Object {
      [name: string]: Node
    }
  }

  export type Write = Write.Node

  export namespace Write {
    export type Node = FileContent | Function | FileSystemRepresentation | Object
    export type FileContent = Read.FileContent | Buffer
    export type Function = (name: string) => Promise<void> | void

    export interface Object {
      readonly [name: string]: Node
    }
  }
}

export interface NestedReadOptions {
  readonly stat?: NestedReadOptions.StatFunc
  readonly onerror?: NestedReadOptions.ErrorHandler
  readonly onunknown?: NestedReadOptions.Unknown
}

export namespace NestedReadOptions {
  export type StatFunc = (name: string) => Promise<Stats> | Stats
  export type ErrorHandler = (error: Error) => FileSystemRepresentation.Exception.ErrorCarrier
  export type Unknown = (x: Unknown.Param) => FileSystemRepresentation.Exception.Other

  export namespace Unknown {
    export interface Param {
      readonly name: string
      readonly stats: Stats
    }
  }
}

export abstract class FileSystemRepresentation {
  abstract async write (target: string): Promise<void>
}

export namespace FileSystemRepresentation {
  export class File extends FileSystemRepresentation {
    private readonly content: File.Content

    constructor (content: File.Content) {
      super()
      this.content = content
    }

    async write (filename: string) {
      await fsx.writeFile(filename, this.content)
    }
  }

  export namespace File {
    export type Content = Tree.Write.FileContent
  }

  export class Directory extends FileSystemRepresentation {
    private readonly content: Directory.Content

    constructor (content?: Directory.Content | null) {
      super()
      this.content = content || {}
    }

    async write (dirname: string) {
      if (fsx.existsSync(dirname)) {
        const stats = await fsx.stat(dirname)
        if (!stats.isDirectory()) {
          throw new Error(`Entity ${dirname} exists but is not directory`)
        }
      } else {
        await fsx.mkdir(dirname)
      }

      await Promise.all(
        Object
          .entries(this.content)
          .map(([key, val]): [string, Tree.Write] => [path.join(dirname, key), val])
          .map(([newContainer, newTree]) => create(newTree, newContainer))
      )
    }
  }

  export namespace Directory {
    export type Content = Tree.Write.Object
  }

  export class Symlink extends FileSystemRepresentation {
    private readonly linkTarget: string
    private readonly type?: Symlink.Options.Type

    constructor (linkTarget: string, options: Symlink.Options = {}) {
      super()
      this.linkTarget = linkTarget
      Object.assign(this, options)
    }

    async write (linkName: string) {
      await fsx.symlink(linkName, this.linkTarget, this.type)
    }
  }

  export namespace Symlink {
    export interface Options {
      readonly type?: Options.Type
    }

    export namespace Options {
      export type Type = 'dir' | 'file' | 'junction'
    }
  }

  export abstract class Exception extends FileSystemRepresentation {}

  export namespace Exception {
    export class ErrorCarrier extends Exception {
      readonly error: Error

      constructor (error: Error) {
        super()
        this.error = error
      }

      async write () {
        throw this.error
      }
    }

    export abstract class Other extends Exception {}
  }
}

export default FileSystemRepresentation
