import path from 'path'

import {
  cmds,
  tags,
  bin,
  ExitStatusCode
} from '../index'

describe('bin', () => {
  it('matches package.json', () => {
    expect(bin).toBe(path.resolve(
      __dirname,
      '..',
      require('../package.json').bin['smart-publish']
    ))
  })
})

describe('ExitStatusCode', () => {
  it('matches snapshot', () => {
    expect(ExitStatusCode).toMatchSnapshot()
  })
})

describe('cmds', () => {
  const name = '<PackageName>'

  it('when version is invalid', () => {
    expect(() => cmds(name, '<InvalidVersion>')).toThrowErrorMatchingSnapshot()
  })

  it('when version has no suffix', () => {
    const result = cmds(name, '0.1.2')
    expect(result).toEqual([['publish', '--access', 'public']])
  })

  it('when version has a non-text suffix', () => {
    const result = cmds(name, '0.1.2-3')
    expect(result).toEqual([['publish', '--tag', 'prerelease', '--access', 'public']])
  })

  it('when version has a text suffix', () => {
    const result = cmds(name, '0.1.2-rc0')
    expect(result).toMatchSnapshot()
  })

  it('when version has a suffix of exactly 0', () => {
    const result = cmds(name, '0.1.2-0')
    expect(result).toEqual([['publish', '--tag', 'prerelease', '--access', 'public']])
  })
})

describe('tags', () => {
  it('when suffix is not provided', () => {
    expect(tags()).toEqual(new Set())
  })

  it('when suffix is non-text', () => {
    expect(tags('123')).toEqual(new Set(['prerelease']))
  })

  it('when suffix is text', () => {
    expect(tags('rc0')).toEqual(new Set(['rc', 'prerelease']))
  })

  it('when suffix is exactly 0', () => {
    expect(tags('0')).toEqual(new Set(['prerelease']))
  })

})
