import {listMismatchedDependencies} from '../../../index'
import createSetupTeardown from '../../.lib/setup-teardown'
import iterate from '../../.lib/all-mismatch-checkers'
import {Checker} from '../../../lib/mismatches'

const {apply} = createSetupTeardown('mismatched-deps.yaml')
const root = 'root'

describe('getMismatchedDependencies', () => {
  iterate((check, checkerName) => {
    describe(`when checker is ${checkerName}`, () => {
      const get = () => listMismatchedDependencies(root, check)
      it('matches snapshot', apply(async () => {
        expect(await get()).toMatchSnapshot()
      }))
    })
  })
})
