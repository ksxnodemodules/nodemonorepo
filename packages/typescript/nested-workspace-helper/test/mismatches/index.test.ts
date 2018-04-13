import getMismatchedDependencies, {Checker} from '../../lib/mismatches'
import createSetupTeardown from '../lib/setup-teardown'
import iterate from '../lib/all-mismatch-checkers'

const {apply} = createSetupTeardown('mismatched-deps.yaml')
const root = 'root'

describe('getMismatchedDependencies', () => {
  iterate((check, checkerName) => {
    describe(`when checker is ${checkerName}`, () => {
      const get = () => getMismatchedDependencies(root, check)
      it('matches snapshot', apply(async () => {
        expect(await get()).toMatchSnapshot()
      }))
    })
  })
})
