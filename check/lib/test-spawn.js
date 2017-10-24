'use strict'

function main ({
  path = require('path'),
  childProcess: {spawnSync} = require('child_process'),
  process: {env} = require('process'),
  alwaysPrintStdIO = false,
  defaultExecutable = 'echo',
  envMiddleName = '?'
} = {}) {
  const {
    [`JEST_${envMiddleName}_EXECUTABLE`]: executable = defaultExecutable,
    [`JEST_${envMiddleName}_ARGV`]: spawnArguments = '[]',
    [`JEST_${envMiddleName}_SKIP`]: skipSpawnTesting = 'false'
  } = env

  const wdir = path.resolve(__dirname, '../..')

  test('JavaScript Code Style: StandardJS', () => {
    if (skipSpawnTesting.toLowerCase() === 'true') return

    const argv = JSON.parse(spawnArguments)
    expect(argv).toBeInstanceOf(Array)

    const {
      stdout,
      stderr,
      signal,
      error,
      status
    } = spawnSync(executable, argv, {cwd: wdir, shell: true})

    if (stdout === null) console.warn('respose.stdout is null')
    if (stderr === null) console.warn('respose.stderr is null')
    if (signal) console.warn(`respose.signal is ${JSON.stringify(signal)}`)
    if (error) throw error
    if (status) throw new Error(stderr + '\n' + stdout)
    if (alwaysPrintStdIO) console.log(stderr + '\n' + stdout)
  })
}

module.exports = main
