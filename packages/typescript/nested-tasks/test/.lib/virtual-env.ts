import * as path from 'path'
import * as fsTreeUtils from 'fs-tree-utils'
import * as xjest from 'extra-jest'
const {Symlink, Clone} = fsTreeUtils.FileSystemRepresentation

const treeDir = path.resolve(__dirname, '../.data/tree')

const tree = {
  api: new Symlink(path.resolve(treeDir, 'api')),
  root: new Clone(path.resolve(treeDir, 'root')),
  'tsconfig.json': new Clone(path.resolve(__dirname, '../../../tsconfig.json5'))
}

export const createVirtualEnvironment = () =>
  xjest.setupTeardown.virtualEnvironment.createFactory(tree)

export default createVirtualEnvironment
