import createSetupTeardown from '../../.lib/setup-teardown'
import tracker, {Executor} from '../.lib/spawn-fs'

const {apply} = createSetupTeardown('valid.yaml')
const argv2desc = (...argv: string[]): string => `$ ${argv.join(' ')}`

const createTester = (
  factory: Executor,
  ...baseArgv: string[]
) => (...argv: string[]) => {
  const finalArgv = [
    'manifest',
    'write',
    ...baseArgv,
    ...argv
  ]

  it(
    argv2desc(...finalArgv),
    apply(factory('.', ...finalArgv))
  )
}

const trackHelpMessage = createTester(tracker.unchanged.snap)
const trackPropertySetting = createTester(tracker, '.', 'set', 'abc.def.ghi', '{hello: world}')
const trackPropertyDeletion = createTester(tracker, '.', 'delete', 'version')
const trackPropertyAssignment = createTester(tracker, '.', 'assign', 'dependencies', '{foo: bar}')

beforeEach(() => {
  jest.setTimeout(131072)
})

afterEach(() => {
  jest.setTimeout(5000)
})

describe('Show help', () => trackHelpMessage())
describe('Set property', () => trackPropertySetting())
describe('Delete property', () => trackPropertyDeletion())
describe('Merge property', () => trackPropertyAssignment())
