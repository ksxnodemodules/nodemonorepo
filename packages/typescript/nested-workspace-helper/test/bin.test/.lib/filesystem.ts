import * as fsTreeUtils from 'fs-tree-utils'
import * as xjest from 'extra-jest'
import { FlatReadResultValue } from '../../../../fs-tree-utils/lib/read'

export type Act = (prev: FlatReadResultValue) => Promise<void>
export type Factory = (dirname?: string, act?: Act) => () => Promise<void>

const defaultAct: Act = () => Promise.resolve()

export const snap = (x: any) => xjest.snap.safe(x)()

export function createFactory (
  callback: (
    before: FlatReadResultValue,
    after: FlatReadResultValue,
    dirname: string,
    act: Act
  ) => any
): Factory {
  return (dirname = '.', act = defaultAct) => async () => {
    const before = await fsTreeUtils.read.flat(dirname)
    act(before)
    const after = await fsTreeUtils.read.flat(dirname)
    callback(before, after, dirname, act)
  }
}

export const snapFileSystem = createFactory(
  (before, after) => snap({ before, after })
)

export const unchangedFileSystem = createFactory(
  (before, after) => expect(after).toEqual(before)
)

export const snapAndUnchanged = createFactory(
  (before, after) => {
    expect(after).toEqual(before)
    snap({ before, after })
  }
)
