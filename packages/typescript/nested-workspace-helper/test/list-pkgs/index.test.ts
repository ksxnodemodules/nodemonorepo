import listAllPackages from '../../lib/list-pkgs'
import createSetupTeardown from '../lib/setup-teardown'

const {apply} = createSetupTeardown('valid.yaml')
const root = 'root'

describe('listAllPackages function', () => {
  it('matches snapshot', apply(async () => {
    expect(await listAllPackages(root)).toMatchSnapshot()
  }))
})
