import * as path from 'path'
import * as fsTreeUtils from 'fs-tree-utils'
import * as assets from 'monorepo-shared-assets'
import { updateExternalDependencyVersions } from '../../../index'
import createSetupTeardown from '../../.lib/setup-teardown'

const { apply } = createSetupTeardown('outdated.yaml')

runTest()
runTest({ baseOnInstalled: true })

function runTest (
  options?: updateExternalDependencyVersions.FullOptions
) {
  const description = `with options=${options ? JSON.stringify(options) : 'undefined'}`
  it(description, apply(update))

  async function update () {
    const before = await readFileTree()
    await updateExternalDependencyVersions('root', options)
    const after = await readFileTree()
    expect(assets.zip.object(before, after)).toMatchSnapshot()
  }

  async function readFileTree () {
    const { fileContents } = await fsTreeUtils.read.flat(
      'root',
      {
        deep: x => x.item !== 'node_modules'
      }
    )

    let result: {[_: string]: any} = {}

    for (const [key, value] of Object.entries(fileContents)) {
      if (path.basename(key) !== 'package.json') continue
      result[key] = JSON.parse(value)
    }

    return result
  }
}
