import * as path from 'path'
import * as fsx from 'fs-extra'
import {WriteFileContent, WriteTreeObject, WriteTree} from '../../types'
import create from '../../create'

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
    export type Content = WriteFileContent
  }

  export class Directory extends FileSystemRepresentation {
    readonly content: Directory.Content

    constructor (content: Directory.Content) {
      super()
      this.content = content
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
          .map(([key, val]): [string, WriteTree] => [path.join(dirname, key), val])
          .map(([newContainer, newTree]) => create(newTree, newContainer))
      )
    }
  }

  export namespace Directory {
    export type Content = WriteTreeObject
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
}

export default FileSystemRepresentation
