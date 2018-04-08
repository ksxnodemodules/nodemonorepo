import * as path from 'path'
import * as os from 'os'
import * as process from 'process'
import * as fsx from 'fs-extra'
import * as fsTreeUtils from 'fs-tree-utils'

const randomString = () =>
  Math.random().toString(36).slice(2)

const encodedDate = () =>
  Date.now().toString(36)

const getTmpName = () =>
  path.join(os.tmpdir(), `tmp.${randomString()}.${encodedDate()}`)

export function create (treefile: string, container = getTmpName()) {
  const oldWorkingDirectory = process.cwd()

  const tree = require(
    path.resolve(__dirname, '../data', treefile)
  )

  const info = {
    treefile,
    container,
    oldWorkingDirectory,
    tree
  }

  async function populate () {
    await depopulate()
    await fsTreeUtils.create(tree, container)
    return info
  }

  async function depopulate () {
    await fsx.remove(container)
    return info
  }

  async function setup () {
    await populate()
    process.chdir(container)
  }

  async function teardown () {
    process.chdir(oldWorkingDirectory)
    await depopulate()
  }

  const apply = (fn: (x: typeof info) => Promise<void>) => async () => {
    await setup()
    await fn(info)
    await teardown()
  }

  return {
    apply,
    setup,
    teardown,
    info,
    __internal: {
      populate,
      depopulate,
      ...info
    }
  }
}

export default create
