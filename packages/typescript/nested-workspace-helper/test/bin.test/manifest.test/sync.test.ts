import createSetupTeardown from '../../.lib/setup-teardown'
import tracker, {Executor} from '../.lib/spawn-fs'

type TestFunction = (...argv: string[]) => void

const {apply} = createSetupTeardown('manifest-sync.yaml')
const argv2desc = (...argv: string[]): string => `$ ${argv.join(' ')}`

const createTester = (
  factory: Executor,
  ...baseArgv: string[]
): TestFunction =>
  (...argv) => {
    const finalArgv = [
      'manifest',
      'sync',
      ...baseArgv,
      ...argv
    ]

    it(
      argv2desc(...finalArgv),
      apply(factory('.', ...finalArgv))
    )
  }

const trackHelpMessage = createTester(tracker.unchanged.snap)
const trackPropertySetting = createTester(tracker, 'root/target', 'set')
const trackPropertyDeletion = createTester(tracker, 'root/target', 'delete')
const trackPropertyAssignment = createTester(tracker, 'root/target', 'assign')

beforeEach(() => {
  jest.setTimeout(131072)
})

afterEach(() => {
  jest.setTimeout(5000)
})

describe('Show help', () => trackHelpMessage())

describe('Set properties', () => {
  trio(trackPropertySetting, '--source=root/source')
  trio(trackPropertySetting, '--source=root/source/package.json')
})

describe('Delete properties', () => {
  trio(trackPropertyDeletion)
})

describe('Merge properties', () => {
  trio(trackPropertyAssignment, '--source=root/source')
  trio(trackPropertyAssignment, '--source=root/source/package.json')
})

function trio (fn: TestFunction, ...argv: string[]) {
  fn('tree', ...argv)
  fn('tree.b', ...argv)
  fn('tree.b.b', ...argv)
  fn('tree.b.b.b', ...argv)
}
