import * as fsx from 'fs-extra'
import * as xjest from 'extra-jest'
import * as fsTreeUtils from 'fs-tree-utils'
import {writePackageManifests} from '../../../index'
import createSetupTeardown from '../../.lib/setup-teardown'

const {apply} = createSetupTeardown('valid.yaml')
const snap = (x: any) => xjest.snap.safe(x)()
const snapFsTree = async () => snap(await fsTreeUtils.read.nested('root'))

const transformer: writePackageManifests.Transformer = item =>
  ({
    ...item.manifestContent,
    extra: {
      dirname: item.path,
      filename: item.manifestFile
    }
  })

it('works with default parameters', apply(async () => {
  await writePackageManifests('root', transformer)
  await snapFsTree()
}))

it('works with specified options', apply(async () => {
  await writePackageManifests(
    'root',
    transformer,
    {
      indentation: 4,
      finalNewLine: 0
    }
  )

  await snapFsTree()
}))
