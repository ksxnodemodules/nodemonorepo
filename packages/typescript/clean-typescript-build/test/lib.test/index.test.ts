import * as fsTreeUtils from 'fs-tree-utils'
import {clean, listAllTargets} from '../../index'
import createVirtualEnv from '../.lib/virtual-env'
import testTargetCorrectness from '../.lib/target-correctness'

const {apply} = createVirtualEnv()

it('should list correct target files', apply(async () => {
  const [all, targets] = await Promise.all([
    fsTreeUtils.read.flat('root'),
    listAllTargets('root')
  ])

  testTargetCorrectness(all, targets)
}))

it('should delete correct target files', apply(async () => {
  const before = await fsTreeUtils.read.flat('root')
  const report = await clean('root')
  const after = await fsTreeUtils.read.flat('root')

  testTargetCorrectness(before, report.targets)

  expect(report.success).toEqual(report.targets)
  expect(report.failure).toEqual([])

  expect({
    report,
    state: [
      {before},
      {after}
    ]
  }).toMatchSnapshot()
}))
