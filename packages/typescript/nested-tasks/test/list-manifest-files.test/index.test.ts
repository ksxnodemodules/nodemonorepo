import {listManifestFiles} from '../../index'
import createVirtualEnvironment from '../.lib/virtual-env'

const {apply} = createVirtualEnvironment()

it('without options', apply(async () => {
  const sample = await listManifestFiles('root')
  expect(sample).toMatchSnapshot()
}))
