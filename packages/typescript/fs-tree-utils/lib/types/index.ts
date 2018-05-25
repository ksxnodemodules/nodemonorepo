import {Stats} from 'fs'
import FileSystemRepresentation from '../classes/fs-representation'

export type FileContent = string
export type TreeObject = {[name: string]: TreeNode}
export type TreeNode = FileContent | TreeObject
export type Tree = TreeNode

export type WriteFileContent = FileContent | Buffer
export type WriteFunction = (name: string) => Promise<void> | void
export type WriteTreeObject = {readonly [name: string]: WriteTreeNode}
export type WriteTreeNode = WriteFileContent | WriteFunction | WriteTreeObject | FileSystemRepresentation
export type WriteTree = WriteTreeNode

export type ReadFileContent = FileContent
export type ReadTreeObject = {[name: string]: ReadTreeNode}
export type ReadTreeNode = ReadFileContent | FileSystemRepresentation.Symlink | ReadTreeObject
export type ReadTree = ReadTreeNode

export type StatFunc = (name: string) => Promise<Stats> | Stats

export interface NestedReadOptions {
  readonly stat?: StatFunc
}
