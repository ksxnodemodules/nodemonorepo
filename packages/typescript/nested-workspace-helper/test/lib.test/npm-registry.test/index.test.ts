import {npmRegistry} from '../../../index'
import {mkhref} from '../../../lib/npm-registry'

it('mkhref', () => {
  expect(
    mkhref(['abc', 'def', 'ghi'], npmRegistry.REGISTRIES.NPM)
  ).toMatchSnapshot()
})

describe('mocked fetch', () => {
  const mkfn = (fn: () => Promise<any>) => async () => {
    expect(await fn()).toMatchSnapshot()
  }

  describe('getAllVersions', () => {
    it('of foo', mkfn(() => npmRegistry.npm.getAllVersions('foo')))
    it('of bar', mkfn(() => npmRegistry.npm.getAllVersions('bar')))
  })

  describe('getSpecificVersion', () => {
    it('of foo@0.1.2', mkfn(() => npmRegistry.npm.getSpecificVersion('foo', '0.1.2')))
    it('of bar@3.3.4', mkfn(() => npmRegistry.npm.getSpecificVersion('bar', '3.3.4')))
  })

  describe('getLatestVersion', () => {
    it('of foo', mkfn(() => npmRegistry.npm.getLatestVersion('foo')))
    it('of bar', mkfn(() => npmRegistry.npm.getLatestVersion('bar')))
  })
})
