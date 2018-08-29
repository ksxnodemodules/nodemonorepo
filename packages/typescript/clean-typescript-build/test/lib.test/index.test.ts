import * as fsTreeUtils from 'fs-tree-utils'
import {clean, listAllTargets} from '../../index'
import createVirtualEnv from '../.lib/virtual-env'

const {apply} = createVirtualEnv()

it('should list correct target files', apply(async () => {
  const [all, targets] = await Promise.all([
    fsTreeUtils.read.flat('root'),
    listAllTargets('root')
  ])

  const deletedFileContents = targets.map(filename => ({
    filename,
    content: all.fileContents[filename]
  }))

  const remainingFileContents = all.files
    .filter(filename => !targets.includes(filename) && !/__describe$/.test(filename))
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
}))
