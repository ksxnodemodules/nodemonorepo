import createSetupTeardown from '../../.lib/setup-teardown'
import tracker, {Executor} from '../.lib/spawn-fs'

const {apply} = createSetupTeardown('mismatched-deps.yaml')

const argv2desc = (...argv: string[]): string => `$ ${argv.join(' ')}`

const createTester = (
  factory: Executor,
  ...baseArgv: string[]
) => (...argv: string[]) => {
  const finalArgv = [
    'version-management',
    'mismatches',
    ...baseArgv,
    ...argv
  ]

  it(
    argv2desc(...finalArgv),
    apply(factory('.', ...finalArgv))
  )
}

const trackVermanMismatches = createTester(tracker.unchanged.snap)
const trackVermanMismatchesUpdate = createTester(tracker, '--update')

beforeEach(() => {
  jest.setTimeout(65536)
})

afterEach(() => {
  jest.setTimeout(5000)
})

describe('show help', () => {
  trackVermanMismatches()
})

describe('without modifying filesystem', () => {
  trackVermanMismatches('.')
  trackVermanMismatches('--jsonOutput', '.')
})

describe('with modifying filesystem', () => {
  describe('with normal stdout', () => {
    trackVermanMismatchesUpdate('.')
  })

  describe('with json stdout', () => {
    trackVermanMismatchesUpdate('--jsonOutput', '.')
  })

  describe('without stdout', () => {
    trackVermanMismatchesUpdate('--noPrint', '.')
  })
})
