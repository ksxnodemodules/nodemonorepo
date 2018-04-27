import createSetupTeardown from '../../.lib/setup-teardown'
import listAllInvalidPackages from '../../../lib/invalids'

const {apply} = createSetupTeardown('invalids.yaml')
const getPromise = () => listAllInvalidPackages('root')

it('matches snapshot', apply(async () => {
  expect(await getPromise()).toMatchSnapshot()
}))

it('contains no valid packages', apply(async () => {
  const result = await getPromise()
  const failure = result.filter(x => x.manifestContent.__expect === 'Valid')
  expect(failure).toEqual([])
}))

it('contains only invalid packages', apply(async () => {
  const result = await getPromise()
  const failure = result.filter(x => x.manifestContent.__expect !== 'Invalid')
  expect(failure).toEqual([])
}))
