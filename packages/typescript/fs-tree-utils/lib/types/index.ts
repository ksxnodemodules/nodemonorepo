import FileSystemRepresentation from '../classes/fs-representation'

export type FileContent = string
export type TreeObject = {[name: string]: TreeObject | FileContent}
export type TreeNode = FileContent | TreeObject
export type Tree = TreeNode

export type WriteFileContent = FileContent | Buffer
export type WriteFunction = (name: string) => Promise<void> | void
export type WriteTreeObject = {readonly [name: string]: WriteTreeObject | WriteFileContent}
export type WriteTreeNode = WriteFileContent | WriteFunction | WriteTreeObject | FileSystemRepresentation
export type WriteTree = WriteTreeNode
