import * as subject from '../../../lib/npm-registry'

it('mkhref', () => {
  expect(subject.mkhref(['abc', 'def', 'ghi'])).toMatchSnapshot()
})

describe('mocked fetch', () => {
  const mkfn = (fn: () => Promise<any>) => async () => {
    expect(await fn()).toMatchSnapshot()
  }

  describe('getAllVersions', () => {
    it('of foo', mkfn(() => subject.getAllVersions('foo')))
    it('of bar', mkfn(() => subject.getAllVersions('bar')))
  })

  describe('getSpecificVersion', () => {
    it('of foo@0.1.2', mkfn(() => subject.getSpecificVersion('foo', '0.1.2')))
    it('of bar@3.3.4', mkfn(() => subject.getSpecificVersion('bar', '3.3.4')))
  })

  describe('getLatestVersion', () => {
    it('of foo', mkfn(() => subject.getLatestVersion('foo')))
    it('of bar', mkfn(() => subject.getLatestVersion('bar')))
  })
})
