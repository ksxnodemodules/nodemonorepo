import getMismatchedDependencies, {Checker} from '../../lib/mismatches'
import createSetupTeardown from '../lib/setup-teardown'
import allCheckers from '../lib/all-mismatch-checkers'

const {apply} = createSetupTeardown('mismatched-deps.yaml')
const root = 'root'

function iterateCheckers (fn: (check: Checker, name: string) => void) {
  Object
    .entries(allCheckers)
    .forEach(([name, check]) => fn(check, name))
}

describe('getMismatchedDependencies', () => {
  iterateCheckers((check, checkerName) => {
    describe(`when checker is ${checkerName}`, () => {
      const get = () => getMismatchedDependencies(root, check)
      it('matches snapshot', apply(async () => {
        expect(await get()).toMatchSnapshot()
      }))
    })
  })
})
