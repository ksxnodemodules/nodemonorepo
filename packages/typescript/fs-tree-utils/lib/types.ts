export type FileContent = string
export type TreeObject = {[name: string]: TreeObject | FileContent}
export type TreeNode = FileContent | TreeObject
export type Tree = TreeNode
