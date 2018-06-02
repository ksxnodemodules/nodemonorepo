import * as path from 'path'
import * as childProcess from 'child_process'
import * as process from 'process'
import * as fsTreeUtils from 'fs-tree-utils'
import * as pathEnv from 'path-env'
import * as xjest from 'extra-jest'
import PromiseFunc = xjest.setupTeardown.PromiseFunc
import Info = xjest.setupTeardown.virtualEnvironment.Info
const {Symlink, Clone} = fsTreeUtils.FileSystemRepresentation
const {env} = process

const tree = {
  api: new Clone(path.resolve(__dirname, '../../api')),
  root: new Clone(path.resolve(__dirname, '../.data/tree/root')),
  node_modules: new Symlink(path.resolve(__dirname, '../../../../../node_modules')),
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

  const nodePaths = [
    '../../node_modules',
    '../../../../../node_modules'
  ].map(x => path.resolve(__dirname, x))

  const PATH = pathEnv.pathString(env.PATH || '').prepend([bin]).get.string()
  const NODE_PATH = pathEnv.pathString(env.NODE_PATH || '').prepend(nodePaths).get.string()

  return async (info: Info) => {
    const {status, stdout, stderr, error} = childProcess.spawnSync(
      'tsc',
      [
        '--preserveSymlinks'
      ],
      {
        encoding: 'utf8',
        env: {
          ...env,
          PATH,
          NODE_PATH
        }
      }
    )
    if (error) throw error
    if (status) throw new Error(`Failed to compile.\nStatus: ${status}.\n${stdout}\n${stderr}`)
    return fn(info)
  }
}

export default createVirtualEnvironment
