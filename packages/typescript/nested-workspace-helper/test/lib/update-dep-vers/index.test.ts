import updateDependencyVersions from '../../../lib/update-dep-vers'
import createSetupTeardown from '../lib/setup-teardown'
import iterate from '../lib/all-mismatch-checkers'
import * as fsTreeUtils from 'fs-tree-utils'
import * as xjest from 'extra-jest'

const {apply} = createSetupTeardown('mismatched-deps.yaml')
const root = 'root'

describe('updateDependencyVersions works', () => {
  iterate((check, checkerName) => {
    const update = async () => {
      await updateDependencyVersions(root, check)
      return await fsTreeUtils.read.flat(root)
    }

    it(`when checker is ${checkerName}`, apply(async () => {
      xjest.snap.unsafe(await update())()
    }))
  })
})
