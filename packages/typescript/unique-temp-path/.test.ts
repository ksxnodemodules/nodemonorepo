// tslint:disable:no-implicit-dependencies

import * as path from 'path'
import * as os from 'os'
import { spawnSync } from 'child_process'
import * as envMod from 'path-env'
import * as subject from './index'

const checkTempPath = (tmp: string, rgx: RegExp) => {
  expect(tmp.slice(0, os.tmpdir().length)).toBe(os.tmpdir())
  expect(tmp.slice(os.tmpdir().length)).toMatch(rgx)
}

const spawnTempPath = (argv: string[]) =>
  spawnSync(
    path.resolve(__dirname, 'node_modules/.bin/preloaded-node'),
    [
      require.resolve('./bin.inrepo.js'),
      ...argv
    ],
    {
      encoding: 'utf8',
      env: envMod.pathEnv()
        .set.name('PATH')
        .path.append(module.paths.map(x => path.resolve(x, 'node_modules/.bin')))
        .get.env()
    }
  )

const checkSpawnTempPath = (argv: string[], rgx: RegExp) => {
  const { status, error, stdout, stderr } = spawnTempPath(argv)
  expect(status).toBe(0)
  expect(error).toBeFalsy()
  expect(stderr).toBeFalsy()
  checkTempPath(stdout.trim(), rgx)
}

it('module matches snapshot', () => {
  expect(subject).toMatchSnapshot()
})

it('getContainer() returns os.tmpdir()', () => {
  expect(subject.getContainer()).toBe(os.tmpdir())
})

describe('tempPath works as expected', () => {

  it('without providing parameters', () => {
    checkTempPath(subject.tempPath(), /tmp\./)
  })

  it('with a prefix provided', () => {
    checkTempPath(subject.tempPath('prefix'), /prefix/)
  })

  it('with both prefix and suffix provided', () => {
    checkTempPath(subject.tempPath('prefix', 'suffix'), /prefix.+suffix$/)
  })
})

describe('bin.inrepo.js works as expected', () => {

  it('without providing arguments', () => {
    checkSpawnTempPath([], /tmp\./)
  })

  it('with a prefix provided', () => {
    checkSpawnTempPath(['prefix'], /prefix/)
  })

  it('with both prefix and suffix provided', () => {
    checkSpawnTempPath(['prefix', 'suffix'], /prefix.+suffix$/)
  })
})
