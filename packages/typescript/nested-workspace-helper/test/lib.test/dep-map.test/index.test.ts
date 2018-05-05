import {getDependencyMap} from '../../../index'
import createSetupTeardown from '../../.lib/setup-teardown'

const {apply} = createSetupTeardown('valid.yaml')
const root = 'root'

describe('getDependencyMap', () => {
  it('matches snapshot', apply(async () => {
    expect(await getDependencyMap(root)).toMatchSnapshot()
  }))
})
