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
const {FileSystemRepresentation} = subject
const {File, Directory, Symlink, Clone} = FileSystemRepresentation

const createTreeGetter = (container: string) => () => Promise.all([
  subject.read.nested(container),
  subject.read.flat(container)
]).then(([nested, flat]) => ({nested, flat}))

beforeEach(async () => {
  await fsx.mkdir(tmpContainer)
  chdir(tmpContainer)
  await fsx.remove(tmp)
  await fsx.mkdir(tmp)
})

afterEach(async () => {
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
      bar: 'bar',
      baz: new File('baz'),
      qux: new File(Buffer.from('qux'))
    }

    const secondBornFiles = {
      newFileA: 'First New File',
      newFileB: 'Second New File',
      newFileC: Buffer.from('Third New File'),
      newFileD: (x: string) => fsx.writeFile(x, 'Forth New File'),
      newFileE: (x: string) => fsx.writeFileSync(x, 'Fifth New File')
    }

    const firstBornFolders = {
      emptyFoo: {},
      emptyBar: {},
      emptyBaz: new Directory(),
      emptyQux: new Directory({}),
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
      },
      newTreeD: new Directory({
        newTreeA: {},
        newTreeB: new Directory({
          empty: {}
        }),
        newTreeC: {
          empty: {},
          emptyFile: new Directory({
            file: ''
          }),
          nonEmptyFile: {
            file: 'Not empty'
          }
        }
      })
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
      await expect(subject.create(expectedTree, container)).rejects.toMatchSnapshot()
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
      await expect(subject.create(expectedTree, container)).rejects.toMatchSnapshot()
    })
  })

  describe('create symlinks', () => {
    const mkcreate = (container: string) =>
    (tree: any) => subject.create(tree, container)

    const createTest = (
      basename: string,
      stat: subject.NestedReadOptions.StatFunc
    ) => async () => {
      const container = await prepare(basename)
      expect(await subject.read.nested(container, {stat})).toMatchSnapshot()
    }

    it('with fsx.lstat as options.stat', createTest('create.3.0.0', fsx.lstat))
    it('with fsx.lstatSync as options.stat', createTest('create.3.0.0', fsx.lstatSync))
    it('with fsx.stat as options.stat', createTest('create.3.0.0', fsx.stat))
    it('with fsx.statSync as options.stat', createTest('create.3.0.0', fsx.statSync))

    async function prepare (basename: string) {
      const container = path.join(tmp, basename)
      const create = mkcreate(container)
      await fsx.remove(container)
      await create(tree)

      await create({
        topA: {
          toBBB: new Symlink('../topB/middleB/bottomB'),
          toCBA: new Symlink('../topC/middleB/bottomA')
        },
        topB: {
          middleA: {
            toBCA: new Symlink('../../topB/middleC/bottomA')
          }
        },
        topD: {
          toA: new Symlink('../topA'),
          toB: new Symlink('../topB'),
          toC: new Symlink('../topC')
        }
      })

      return container
    }
  })

  it('create clone', async () => {
    const container = path.join(tmp, 'create.4')
    const getTree = createTreeGetter(container)
    await fsx.remove(container)

    const source = {
      directory: {
        file: 'This file is meant to be cloned'
      }
    }

    const target = {
      directory: new Clone(path.resolve(container, 'source/directory')),
      file: new Clone(path.resolve(container, 'source/directory/file'))
    }

    await subject.create({source}, container)
    await subject.create({target}, container)
    expect(await getTree()).toMatchSnapshot()
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
