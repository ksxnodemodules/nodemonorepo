/* tslint:disable:no-floating-promises */

import * as fsTreeUtils from 'fs-tree-utils'
import * as xjest from 'extra-jest'
import { FlatReadResultValue } from 'fs-tree-utils/lib/read'
import createVirtualEnv from '../.lib/virtual-env'
import testTargetCorrectness from '../.lib/target-correctness'

const { apply } = createVirtualEnv()
const bin = require.resolve('../../bin/clean-typescript-build')

const snapSpawn = (...argv: string[]) =>
  xjest.snapSpawn.snap.withCommand(
    'preloaded-node',
    [bin, ...argv],
    {
      encoding: 'utf8'
    }
  )()

beforeEach(() => {
  jest.setTimeout(131072)
})

afterEach(() => {
  jest.setTimeout(5000)
})

it('prints help message', apply(async () => {
  const before = await fsTreeUtils.read.flat('root')

  snapSpawn()
  snapSpawn('--help')

  const after = await fsTreeUtils.read.flat('root')

  expect(before).toEqual(after)
}))

describe('works when directory exists', () => {
  type Tester = (param: TesterParam) => Promise<void>

  interface TesterParam {
    readonly before: FlatReadResultValue
    readonly after: FlatReadResultValue
    readonly removed: ReadonlyArray<string>
  }

  const wrap = (
    test: Tester,
    fn: () => Promise<void>
  ) => apply(async () => {
    const before = await fsTreeUtils.read.flat('root')
    await fn()
    const after = await fsTreeUtils.read.flat('root')
    const removed = before.files.filter(filename => !after.files.includes(filename))
    test({ before, after, removed })
  })

  const dryTest: Tester = async ({ before, after }) => {
    expect(after).toEqual(before)
  }

  const diffTest: Tester = async ({ before, removed }) => {
    testTargetCorrectness(before, removed)
  }

  it('without options', wrap(diffTest, async () => {
    snapSpawn('root')
  }))

  it('with --dry', wrap(dryTest, async () => {
    snapSpawn('root', '--dry')
  }))

  it('with --format=json', wrap(diffTest, async () => {
    snapSpawn('root', '--format=json')
  }))

  it('with --format=none', wrap(diffTest, async () => {
    snapSpawn('root', '--format=none')
  }))
})
