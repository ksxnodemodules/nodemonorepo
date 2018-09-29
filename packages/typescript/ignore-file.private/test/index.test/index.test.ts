import * as fsTreeUtils from 'fs-tree-utils'
import * as xjest from 'extra-jest'
import virtualEnvironment from '../.lib/virtual-env'
import * as subject from '../../index'

const { apply } = virtualEnvironment
const snap = (x: any) => xjest.snap.safe(x)()

it('add', () => {
  expect(subject.add(
    ['middleA', 'removeA', 'middleB', 'removeB'],
    {
      prepend: ['headA', 'headB'],
      append: ['tailA', 'tailB'],
      remove: ['removeA', 'removeB']
    }
  )).toMatchSnapshot()
})

it('getIgnoreFiles', apply(async () => {
  expect(await subject.getIgnoreFiles('.myignore')).toMatchSnapshot()
}))

it('getFilePairs', apply(async () => {
  snap(await subject.getDeltaPairs('.myignore'))
}))

it('getDeltaPairs', apply(async () => {
  const pairs = await subject.getDeltaPairs('.myignore')
  snap(pairs)
  snap(pairs.map(({ delta, ignore }) => ({
    ignore,
    delta: delta.filter(x => Object.keys(x.content).length !== 0)
  })))
}))

it('writeIgnoreFiles', apply(async () => {
  await subject.writeIgnoreFiles(
    'root/.myignore',
    '.myignore',
    'root/container/**'
  )

  snap(await fsTreeUtils.read.nested('root'))

  snap(
    Object
      .entries((await fsTreeUtils.read.flat('root')).fileContents)
      .map(([name, content]) => ({ name, content }))
      .filter(x => /\.myignore$/.test(x.name))
      .map(({ name, content }) => [{ name }, { content }])
  )
}))

describe('minor features', () => {
  const sample = [
    'foo',
    'foo/bar',
    'foo/bar/baz'
  ]

  it('createFileChooser.byExt', () => {
    const ext = ['', ...'abc', 'abc']
    const choose = subject.createFileChooser.byExt(...ext)

    expect(
      sample.map(base => [{ base, ext }, choose(base)])
    ).toMatchSnapshot()
  })

  it('DEFAULT_FILE_CHOOSER', () => {
    expect(
      sample.map(base => [{ base }, subject.DEFAULT_DELTA_FILES_CHOOSER(base)])
    ).toMatchSnapshot()
  })
})
