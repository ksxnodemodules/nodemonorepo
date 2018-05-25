import * as path from 'path'
import {cwd, chdir} from 'process'
import * as fsx from 'fs-extra'
import tempPath from 'unique-temp-path'
import * as subject from '../index'
import {DeepFunc} from '../lib/traverse'
const tree = require('./data/tree.yaml')
const oldCwd = cwd()
const tmpContainer = tempPath('fs-tree-utils.')
const tmp = 'tmp'

const createTreeGetter = (container: string) => () => Promise.all([
  subject.read.nested(container),
  subject.read.flat(container)
]).then(([nested, flat]) => ({nested, flat}))

beforeAll(async () => {
  await fsx.mkdir(tmpContainer)
  chdir(tmpContainer)
  await fsx.remove(tmp)
  await fsx.mkdir(tmp)
})

afterAll(async () => {
  chdir(oldCwd)
  await fsx.remove(tmpContainer)
})

describe('create function', () => {
  it('creates files/directories that yet to exist', async () => {
    const container = path.join(tmp, 'create.0')
    const getTree = createTreeGetter(container)
    await fsx.remove(container)

    await subject.create(tree, container)
    expect(await getTree()).toMatchSnapshot()
  })

  it('ignores already existed files/directories that is not mismatched', async () => {
    const container = path.join(tmp, 'create.1')
    const getTree = createTreeGetter(container)
    await fsx.remove(container)

    const firstBornFiles = {
      foo: 'foo',
      bar: 'bar'
    }

    const secondBornFiles = {
      newFileA: 'First New File',
      newFileB: 'Second New File',
      newFileC: new Buffer('Third New File')
    }

    const firstBornFolders = {
      emptyFoo: {},
      emptyBar: {},
      firstBornFiles
    }

    const secondBornFolders = {
      newTreeA: {},
      newTreeB: {
        empty: {}
      },
      newTreeC: {
        empty: {},
        emptyFile: {
          file: ''
        },
        nonEmptyFile: {
          file: 'Not empty'
        }
      }
    }

    await subject.create({
      ...firstBornFiles,
      ...firstBornFolders
    }, container)
    const firstBorn = await getTree()

    await subject.create({
      ...firstBornFiles,
      ...firstBornFolders,
      ...secondBornFiles,
      ...secondBornFolders
    }, container)
    const secondBorn = await getTree()

    expect({firstBorn, secondBorn}).toMatchSnapshot()
  })

  describe('throws error when encounter mismatched entities', () => {
    it('in which a file is requested in place of a folder', async () => {
      const container = path.join(tmp, 'create.2.0')
      await fsx.remove(container)

      const existingTree = {
        mismatched: {}
      }

      const expectedTree = {
        mismatched: ''
      }

      await subject.create(existingTree, container)
      expect(subject.create(expectedTree, container)).rejects.toMatchSnapshot()
    })

    it('in which a folder is requested in place of a file', async () => {
      const container = path.join(tmp, 'create.2.1')
      await fsx.remove(container)

      const existingTree = {
        mismatched: ''
      }

      const expectedTree = {
        mismatched: {}
      }

      await subject.create(existingTree, container)
      expect(subject.create(expectedTree, container)).rejects.toMatchSnapshot()
    })
  })
})

describe('traverse function', () => {
  const container = path.join(tmp, 'traverse.0')

  const init = async () => {
    await fsx.remove(container)
    await subject.create(tree, container)
  }

  const createFunc = (deep?: DeepFunc, level?: number) => async () =>
    (await subject.traverse(container, deep, level))
      .map(({item, path, container, level}) => ({item, path, container, level}))

  const createTester = (deep?: DeepFunc, level?: number) => async () => {
    const fn = createFunc(deep, level)
    await init()
    expect(await fn()).toMatchSnapshot()
  }

  it('works with default `deep` and `level`', createTester())
  it('only dig names end with "B"', createTester(x => /B$/.test(x.item)))
  it('does not dig names end with "B"', createTester(x => !/B$/.test(x.item)))
  it('works with provided `deep` and `level`', createTester(() => true, 3))
})
