import * as fsTreeUtils from 'fs-tree-utils'
import * as xjest from 'extra-jest'

const snap = (x: any) => xjest.snap.safe(x)

export async function flat () {
  snap(await fsTreeUtils.read.flat('.'))
}

export async function nested () {
  snap(await fsTreeUtils.read.nested('.'))
}
