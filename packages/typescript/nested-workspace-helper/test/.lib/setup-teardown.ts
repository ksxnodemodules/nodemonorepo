import * as path from 'path'
import * as xjest from 'extra-jest'

export function create (treefile: string, container?: string) {
  const tree = require(
    path.resolve(__dirname, '../.data', treefile)
  )

  const {
    info,
    apply
  } = xjest.setupTeardown.virtualEnvironment.createFactory(tree, container)

  return {
    info: Object.assign(info, {tree}),
    apply
  }
}

export default create
