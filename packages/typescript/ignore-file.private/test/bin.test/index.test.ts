import * as xjest from 'extra-jest'
import * as fsTreeUtils from 'fs-tree-utils'
import {spawnSync} from 'preloaded-node.private'
import {bin} from '../.lib/data'
import virtualEnvironment from '../.lib/virtual-env'

const {apply} = virtualEnvironment

const addArgv = (argv: ReadonlyArray<string>) => [bin, ...argv]

const snapSpawn = (...argv: string[]) =>
  xjest.snapSpawn.snap(spawnSync, addArgv(argv))

const snapAny = (x: any) => xjest.snap.safe(x)()

beforeEach(() => {
  jest.setTimeout(131072)
})

afterEach(() => {
  jest.setTimeout(5000)
})

describe('help message', () => {
  it('from igfileman', snapSpawn())
  it('from igfileman write', snapSpawn('write'))
})

describe('command', () => {
  describe('igfileman write', () => {
    const mkfn = (argv: ReadonlyArray<string>) => {
      const finalArgv = addArgv(['write', ...argv])
      return apply(async () => {
        xjest.snapSpawn.spawn(spawnSync, finalArgv)

        snapAny(
          await fsTreeUtils.read.nested('root')
        )

        snapAny(
          Object
            .entries((await fsTreeUtils.read.flat('root')).fileContents)
            .map(([name, content]) => ({name, content}))
            .filter(x => /\.myignore$/.test(x.name))
            .map(({name, content}) => [{name}, {content}])
        )
      })
    }

    const runTest = (...argv: string[]) => it(argv.join(' '), mkfn(argv))

    runTest(
      '--base=root/.myignore',
      '--output=.myignore',
      '--container=root/container/**'
    )
  })
})
