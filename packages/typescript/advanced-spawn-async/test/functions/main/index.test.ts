import {
  ChildProcess
} from 'child_process'

import spawn, {
  main,
  SpawnFactory,
  TerminationError,
  InternalError,
  InternalErrorInformation
} from '../../../index'

import * as data from '../../.lib/data'

type Info = SpawnFactory.TerminationInformation<ChildProcess>
type TermErr = TerminationError<ChildProcess, Info>
type ItnlErr = InternalError<ChildProcess, Error>
type ItnlErrInfo = InternalErrorInformation<ChildProcess, Error>

const redacted = '[REDACTED]'

const sanitize = (
  info: Info | ItnlErrInfo,
  {
    args = false
  }: {
    args?: boolean
  } = {}
) => ({
  ...info,
  process: {
    constructor: {
      name: info.process.constructor.name
    }
  },
  args: args ? info.args : redacted as typeof redacted
})

const sanitizeTerminationError = (error: TermErr) => ({
  ...error,
  message: redacted as typeof redacted,
  stack: redacted as typeof redacted,
  info: sanitize(error.info)
})

const sanitizeInternalError = (error: ItnlErr) => ({
  ...error,
  stack: redacted as typeof redacted,
  message: error.message,
  info: sanitize(error.info)
})

beforeEach(() => {
  jest.setTimeout(131072)
})

afterEach(() => {
  jest.setTimeout(5000)
})

it('export main as default', () => {
  expect(spawn).toBe(main)
})

describe('when executable does not exist', () => {
  const factory = spawn('SomethingThatDoesNotExist')

  it('onclose promise', async () => {
    const result = await factory.onclose.then(
      () => Promise.reject(new Error('factory.close should not resolve')),
      error => error
    )

    expect(sanitizeInternalError(result)).toMatchSnapshot()
  })

  it('onexit promise', async () => {
    const result = await factory.onexit.then(
      () => Promise.reject(new Error('factory.close should not resolve')),
      error => error
    )

    expect(sanitizeInternalError(result)).toMatchSnapshot()
  })
})

describe('when process terminated with non-zero status code', () => {
  const factory = spawn('node', [data.withNonZeroStatus], {env: {HELLO: 'WORLD'}})

  it('onclose promise', async () => {
    const result = await factory.onclose.then(
      () => Promise.reject(new Error('factory.close should not resolve')),
      error => error
    )

    expect(sanitizeTerminationError(result)).toMatchSnapshot()
  })

  it('onexit promise', async () => {
    const result = await factory.onexit.then(
      () => Promise.reject(new Error('factory.close should not resolve')),
      error => error
    )

    expect(sanitizeTerminationError(result)).toMatchSnapshot()
  })
})

describe('when process successfully terminated', () => {
  describe('with minimal arguments', () => {
    const factory = spawn('echo')

    it('process', () => {
      expect({
        ...factory,
        process: {
          constructor: {
            name: factory.process.constructor.name
          }
        }
      }).toMatchSnapshot()
    })

    describe('close promise', () => {
      const {onclose} = factory

      it('onclose->process is factory.process', async () => {
        expect((await onclose).process).toBe(factory.process)
      })

      it('matches snapshot', async () => {
        expect(sanitize(await onclose, {args: true})).toMatchSnapshot()
      })
    })

    describe('exit promise', () => {
      const {onexit} = factory

      it('exit->process is factory.process', async () => {
        expect((await onexit).process).toBe(factory.process)
      })

      it('matches snapshot', async () => {
        expect(sanitize(await onexit, {args: true})).toMatchSnapshot()
      })
    })
  })

  describe('with full arguments', () => {
    const factory = spawn('echo', ['hello', 'world'], {env: {HELLO: 'WORLD'}})

    it('onclose promise', async () => {
      expect(sanitize(await factory.onclose, {args: true})).toMatchSnapshot()
    })

    it('onexit promise', async () => {
      expect(sanitize(await factory.onexit, {args: true})).toMatchSnapshot()
    })
  })

  describe('with stdout and stderr', () => {
    const factory = spawn('node', [data.bothStdoutStderr], {env: {HELLO: 'WORLD'}})

    it('onclose promise', async () => {
      expect(sanitize(await factory.onclose)).toMatchSnapshot()
    })

    it('onexit promise', async () => {
      expect(sanitize(await factory.onexit)).toMatchSnapshot()
    })
  })

  describe('with specified stdin', () => {
    const {process, onclose, onexit} = spawn('bash')

    it('close promise', async () => {
      expect(sanitize(await onclose, {args: true})).toMatchSnapshot
    })

    it('exit promise', async () => {
      expect(sanitize(await onexit, {args: true})).toMatchSnapshot
    })

    process.stdin.write('echo stdin foo\n')
    process.stdin.write('echo stderr foo 1>&2\n')
    process.stdin.write('echo stdin bar\n')
    process.stdin.write('echo stderr bar 1>&2\n')
    process.stdin.end('exit 0\n')
  })
})
