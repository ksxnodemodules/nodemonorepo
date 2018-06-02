import * as path from 'path'
import * as childProcess from 'child_process'
import * as fsTreeUtils from 'fs-tree-utils'
import * as pathEnv from 'path-env'
import * as xjest from 'extra-jest'
import PromiseFunc = xjest.setupTeardown.PromiseFunc
import Info = xjest.setupTeardown.virtualEnvironment.Info
const {Symlink, Clone} = fsTreeUtils.FileSystemRepresentation

const treeDir = path.resolve(__dirname, '../.data/tree')

const tree = {
  api: new Symlink(path.resolve(treeDir, 'api')),
  root: new Clone(path.resolve(treeDir, 'root')),
  'tsconfig.json': new Clone(path.resolve(__dirname, '../../../tsconfig.json5'))
}

export const createVirtualEnvironment = (tsc = false) => {
  const {apply, ...rest} = xjest.setupTeardown.virtualEnvironment.createFactory(tree)
  return {
    apply: (fn: PromiseFunc<Info, void>) => apply(wrapCallback(fn, tsc)),
    ...rest
  }
}

function wrapCallback (fn: PromiseFunc<Info, void>, tsc: boolean) {
  if (!tsc) return fn
  const bin = path.resolve(__dirname, '../../../../../node_modules/.bin')
  const env = pathEnv.pathEnv().path.append([bin])
  return async (info: Info) => {
    const {status, stderr} = childProcess.spawnSync('tsc', {
      encoding: 'utf8',
      env
    })
    if (status) throw new Error(`Failed to compile.\nStatus: ${status}.\n${stderr}`)
    return fn(info)
  }
}

export default createVirtualEnvironment
