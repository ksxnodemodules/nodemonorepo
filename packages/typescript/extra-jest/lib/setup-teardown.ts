import * as process from 'process'
import * as fsx from 'fs-extra'
import * as fsTreeUtils from 'fs-tree-utils'
import tempPath from 'unique-temp-path'
import {TreeObject} from 'fs-tree-utils'

export type PromiseFunc<X, Y> = (x: X) => Promise<Y>
export type SyncFunc<X, Y> = (x: X) => Y
export type SetupFunc<Y> = () => Promise<Y>
export type TeardownFunc<X> = (x: X) => Promise<void>
export type CalledFunc<X, Y> = PromiseFunc<X, Y>
export type SyncCalledFunc<X, Y> = SyncFunc<X, Y>
export type Tester = () => Promise<void>
export type AsyncTesterFactory<SM, MT> = (fn: CalledFunc<SM, MT>) => Tester
export type SyncTesterFactory<SM, MT> = (fn: SyncCalledFunc<SM, MT>) => Tester

export type Config<SY, TX> = {
  setup: SetupFunc<SY>, teardown: TeardownFunc<TX>
}

export type TesterFactory<SM, MT> = AsyncTesterFactory<SM, MT> & {
  forAsync: AsyncTesterFactory<SM, MT>,
  forSync: SyncTesterFactory<SM, MT>
}

export namespace base {
  export function createFactory<SM, MT> (
    {
      setup,
      teardown
    }: Config<SM, MT>
  ): TesterFactory<SM, MT> {
    const forAsync = (fn: CalledFunc<SM, MT>): Tester =>
      async (): Promise<void> => {
        const sm = await setup()
        const mt = await fn(sm)
        await teardown(mt)
      }

    const forSync = (fn: SyncCalledFunc<SM, MT>): Tester =>
      forAsync(async (sm: SM) => fn(sm))

    return Object.assign(
      forAsync,
      {
        forAsync,
        forSync
      }
    )
  }
}

export const createFactory = base.createFactory

export namespace virtualEnvironment {
  export interface Info {
    readonly tree: TreeObject
    readonly container: string
    readonly previousWorkingDirectory: string
  }

  export function createFactory (tree: TreeObject, container = tempPath()) {
    const previousWorkingDirectory = process.cwd()
    const info: Info = {tree, container, previousWorkingDirectory}

    async function populate () {
      await depopulate()
      await fsTreeUtils.create(tree, container)
      return info
    }

    async function depopulate () {
      await fsx.remove(container)
      return info
    }

    const setup: SetupFunc<Info> = async () => {
      await populate()
      process.chdir(container)
      return info
    }

    const teardown: TeardownFunc<void> = async () => {
      process.chdir(previousWorkingDirectory)
      await depopulate()
    }

    const apply = base.createFactory({setup, teardown})

    return {info, apply}
  }
}

export default createFactory
