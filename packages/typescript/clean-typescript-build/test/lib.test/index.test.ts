import * as fsTreeUtils from 'fs-tree-utils'
import {FlatReadResultValue} from 'fs-tree-utils/lib/read'
import {clean, listAllTargets} from '../../index'
import createVirtualEnv from '../.lib/virtual-env'

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

function testTargetCorrectness (all: FlatReadResultValue, targets: ReadonlyArray<string>) {
  const deletedFileContents = targets.map(filename => ({
    filename,
    content: all.fileContents[filename]
  }))

  const remainingFileContents = all.files
    .filter(filename => !targets.includes(filename) && !/(^|\/)__[a-zA-Z]+$/.test(filename))
    .map(filename => ({filename, content: all.fileContents[filename]}))

  expect({
    targets,
    deletedFileContents,
    remainingFileContents
  }).toMatchSnapshot()

  expect({
    invalidAcceptance: remainingFileContents.filter(x => x.content !== 'Should be kept'),
    invalidDeletion: deletedFileContents.filter(x => x.content !== 'Should be deleted')
  }).toEqual({
    invalidAcceptance: [],
    invalidDeletion: []
  })
}
