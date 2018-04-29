import {listAllPackages} from '../../../index'
import createSetupTeardown from '../../.lib/setup-teardown'

const {apply} = createSetupTeardown('valid.yaml')
const root = 'root'

describe('listAllPackages function', () => {
  it('matches snapshot', apply(async () => {
    expect(await listAllPackages(root)).toMatchSnapshot()
  }))
})
