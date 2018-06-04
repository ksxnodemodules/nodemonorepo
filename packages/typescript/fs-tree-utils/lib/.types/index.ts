import * as path from 'path'
import {Stats} from 'fs'
import * as fsx from 'fs-extra'

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
    export type Function = (name: string, param: CreateSecondParam) => Promise<void> | void

    export interface Object {
      readonly [name: string]: Node
    }
  }
}

export interface CreateSecondParam {
  readonly create: CreateSecondParam.CreateFunc
}

export namespace CreateSecondParam {
  export type CreateFunc = (tree: Tree.Write, container: string) => Promise<void>
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

export namespace Traverse {
  export interface Options {
    readonly deep?: Options.DeepFunc
    readonly level?: Options.Level
  }

  export namespace Options {
    export type DeepFunc = (x: DeepFunc.Param) => DeepFunc.Result

    export namespace DeepFunc {
      export interface Param {
        readonly container: string
        readonly item: string
        readonly path: string
        readonly stats: fsx.Stats
        readonly level: Level
      }

      export type Result = boolean
    }

    export type Level = number
  }

  export type Result = Promise<Result.Value>

  export namespace Result {
    export type Item = Options.DeepFunc.Param
    export type Value = ReadonlyArray<Result.Item>
  }
}

/**
 * This class allows to extends `fsTreeUtils.create`'s functionality.
 *
 * This class is an abstract class that is meant to be extended upon,
 * don't instantiated this class directly!
 */
export abstract class FileSystemRepresentation {
  /**
   * Turn `FileSystemRepresentation` object into a real filesystem entity.
   * @param target Name of filesystem entity that needs to be created or written upon.
   * @param param An object contains `create` function
   * @returns Undefined or promise of undefined.
   */
  abstract write (target: string, param: CreateSecondParam): Promise<void> | void
}

export namespace FileSystemRepresentation {
  /**
   * Represents a file.
   */
  export class File extends FileSystemRepresentation {
    private readonly content: File.Content

    /**
     * @param content A string of Buffer which is content of represented file.
     */
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

  /**
   * Represent a directory.
   */
  export class Directory extends FileSystemRepresentation {
    private readonly content: Directory.Content

    /**
     * @param content An object whose every property represent a child item of represented directory.
     */
    constructor (content?: Directory.Content | null) {
      super()
      this.content = content || {}
    }

    async write (dirname: string, {create}: CreateSecondParam) {
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

  /**
   * Represents a symbolic link
   */
  export class Symlink extends FileSystemRepresentation {
    private readonly linkTarget: string
    private readonly type?: Symlink.Options.Type

    /**
     * @param linkTarget Where symlink points to.
     *   * 🗈 Relative to the represented symlink.
     * @param options Optional.
     *   * Property `type`: Optional. Either 'file', 'dir' or 'junction'. Only matters in Windows.
     * @see https://nodejs.org/api/fs.html#fs_fs_symlink_target_path_type_callback
     */
    constructor (linkTarget: string, options: Symlink.Options = {}) {
      super()
      this.linkTarget = linkTarget
      Object.assign(this, options)
    }

    async write (linkName: string) {
      await fsx.symlink(this.linkTarget, linkName, this.type)
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

  /**
   * Use this to copy files and/or clone directories.
   */
  export class Clone extends FileSystemRepresentation {
    private readonly source: string
    private readonly options?: Clone.Options

    /**
     * @param source Path to source.
     * @param options Options to pass to [`fsExtra.copy`](https://git.io/vh3WC).
     */
    constructor (source: string, options?: Clone.Options) {
      super()
      this.source = source
      this.options = options
    }

    async write (destination: string) {
      await fsx.copy(this.source, destination, this.options)
    }
  }

  export namespace Clone {
    export type Options = fsx.CopyOptions
  }

  /**
   * Represents exceptional/impossible filesystem entities.
   *
   * This class is used by function `read`.
   *
   * Users are not meant to create objects of this class
   * except when the objects are of `FileSystemRepresentation.Exception.Other`.
   */
  export abstract class Exception extends FileSystemRepresentation {}

  export namespace Exception {
    /**
     * Represents a caught `Error` when try to read a filesystem entity.
     *
     * Users are not meant to create objects of this class.
     */
    export class ErrorCarrier extends Exception {
      readonly error: Error

      constructor (error: Error) {
        super()
        this.error = error
      }

      async write () {
        throw this.error // cannot be used in function `create`.
      }
    }

    /**
     * Unlike other subclasses of `FileSystemRepresentation.Exception`,
     * subclasses of this class are meant to instantiated by users.
     *
     * This is an abstract class, don't instantiate it directly,
     * instead, create a subclass that extends it.
     */
    export abstract class Other extends Exception {}
  }
}
