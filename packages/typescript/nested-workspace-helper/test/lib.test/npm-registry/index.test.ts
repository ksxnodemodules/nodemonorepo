import subject, {mkhref} from '../../../lib/npm-registry'

it('mkhref', () => {
  expect(
    mkhref(['abc', 'def', 'ghi'], subject.REGISTRIES.NPM)
  ).toMatchSnapshot()
})

describe('mocked fetch', () => {
  const mkfn = (fn: () => Promise<any>) => async () => {
    expect(await fn()).toMatchSnapshot()
  }

  describe('getAllVersions', () => {
    it('of foo', mkfn(() => subject.npm.getAllVersions('foo')))
    it('of bar', mkfn(() => subject.npm.getAllVersions('bar')))
  })

  describe('getSpecificVersion', () => {
    it('of foo@0.1.2', mkfn(() => subject.npm.getSpecificVersion('foo', '0.1.2')))
    it('of bar@3.3.4', mkfn(() => subject.npm.getSpecificVersion('bar', '3.3.4')))
  })

  describe('getLatestVersion', () => {
    it('of foo', mkfn(() => subject.npm.getLatestVersion('foo')))
    it('of bar', mkfn(() => subject.npm.getLatestVersion('bar')))
  })
})
