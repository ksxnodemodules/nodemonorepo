import createSetupTeardown from '../.lib/setup-teardown'
import snapSpawn from './.lib/snap-spawn'

const argv2desc = (...argv: string[]): string => `$ ${argv.join(' ')}`

const createTester = (argv: string[], tree = 'invalids.yaml') => () => {
  const finalArgv = ['validate', ...argv]
  const {apply} = createSetupTeardown(tree)
  const desc = argv2desc(...finalArgv)
  const func = apply(async () => snapSpawn(finalArgv)())
  it(desc, func)
}

beforeEach(() => {
  jest.setTimeout(131072)
})

afterEach(() => {
  jest.setTimeout(5000)
})

describe('show help', createTester([]))

describe('show invalid packages', () => {
  describe('in lines of text', () => {
    describe('with exit status', createTester(['.']))
    describe('without exit status', createTester(['--noExitStatus', '.']))
  })

  describe('in json format', () => {
    describe('with exit status', createTester(['--jsonOutput', '.']))
    describe('without exit status', createTester(['--jsonOutput', '--noExitStatus', '.']))
  })

  describe('when there is none', () => {
    describe('in lines of text', createTester(['.'], 'valid.yaml'))
    describe('in json format', createTester(['--jsonOutput', '.'], 'valid.yaml'))
  })
})
