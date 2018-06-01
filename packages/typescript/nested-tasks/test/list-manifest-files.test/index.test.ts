import {listManifestFiles} from '../../index'
import createVirtualEnvironment from '../.lib/virtual-env'

const {apply} = createVirtualEnvironment()

it('without options', apply(async () => {
  const sample = await getSample('root')
  expect(sample).toMatchSnapshot()
}))

async function getSample (dirname: string, options?: listManifestFiles.Options) {
  const sample = await listManifestFiles(dirname, options)
  return sample.map(({path, type}) => ({path, type}))
}
