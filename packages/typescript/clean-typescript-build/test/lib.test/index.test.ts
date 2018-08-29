// import * as fsTreeUtils from 'fs-tree-utils'
import {clean, listAllTargets} from '../../index'
import createVirtualEnv from '../.lib/virtual-env'

const {apply} = createVirtualEnv()

it('should list correct target files', apply(async () => {
  const targets = await listAllTargets('root')
  expect(targets).toMatchSnapshot()
  const invalids = targets.filter(x => !/(\.jsx?|\.d\.tsx?)(\.map)?$/.test(x))
  expect(invalids).toEqual([])
}))
