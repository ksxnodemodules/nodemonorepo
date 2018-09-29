import { FlatReadResultValue } from 'fs-tree-utils/lib/read'

export function testTargetCorrectness (all: FlatReadResultValue, targets: ReadonlyArray<string>) {
  const deletedFileContents = targets.map(filename => ({
    filename,
    content: all.fileContents[filename]
  }))

  const remainingFileContents = all.files
    .filter(filename => !targets.includes(filename) && !/(^|\/)__[a-zA-Z]+$/.test(filename))
    .map(filename => ({ filename, content: all.fileContents[filename] }))

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

export default testTargetCorrectness
