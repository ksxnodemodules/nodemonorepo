import {ChildProcess} from 'child_process'
import spawn, {main, SpawnFactory, SpawnError} from '../../../index'
import * as data from '../../.lib/data'

type Info = SpawnFactory.TerminationInformation<ChildProcess>
type SError = SpawnError<ChildProcess, Info>

const redacted = '[REDACTED]'

const sanitize = (
  info: Info,
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

const sanitizeError = (error: SError) => ({
  ...error,
  message: redacted as typeof redacted,
  stack: redacted as typeof redacted,
  info: sanitize(error.info)
})

// beforeEach(() => {
//   jest.setTimeout(131072)
// })

// afterEach(() => {
//   jest.setTimeout(5000)
// })

it('export main as default', () => {
  expect(spawn).toBe(main)
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
      const {close, onclose} = factory

      it('close is onclose()', () => {
        expect(close).toBe(onclose())
      })

      it('close->process is factory.process', async () => {
        expect((await close).process).toBe(factory.process)
      })

      it('matches snapshot', async () => {
        expect(sanitize(await close, {args: true})).toMatchSnapshot()
      })
    })

    describe('exit promise', () => {
      const {exit, onexit} = factory

      it('exit is onexit()', () => {
        expect(exit).toBe(onexit())
      })

      it('exit->process is factory.process', async () => {
        expect((await exit).process).toBe(factory.process)
      })

      it('matches snapshot', async () => {
        expect(sanitize(await exit, {args: true})).toMatchSnapshot()
      })
    })
  })

  describe('with full arguments', () => {
    const process = spawn('echo', ['hello', 'world'], {env: {HELLO: 'WORLD'}})

    it('close promise', async () => {
      expect(sanitize(await process.close, {args: true})).toMatchSnapshot()
    })

    it('exit promise', async () => {
      expect(sanitize(await process.exit, {args: true})).toMatchSnapshot()
    })
  })

  describe('with stdout and stderr', () => {
    const factory = spawn('node', [data.bothStdoutStderr], {env: {HELLO: 'WORLD'}})

    it('close promise', async () => {
      expect(sanitize(await factory.close)).toMatchSnapshot
    })


    it('exit promise', async () => {
      expect(sanitize(await factory.exit)).toMatchSnapshot
    })
  })

  describe('with specified stdin', () => {
    const {process, close, exit} = spawn('bash')

    it('close promise', async () => {
      expect(sanitize(await close, {args: true})).toMatchSnapshot
    })

    it('exit promise', async () => {
      expect(sanitize(await exit, {args: true})).toMatchSnapshot
    })

    process.stdin.write('echo stdin foo\n')
    process.stdin.write('echo stderr foo 1>&2\n')
    process.stdin.write('echo stdin bar\n')
    process.stdin.write('echo stderr bar 1>&2\n')
    process.stdin.end('exit 0\n')
  })
})

describe('when process terminated with non-zero status code', () => {
  const factory = spawn('node', [data.withNonZeroStatus], {env: {HELLO: 'WORLD'}})

  it('close promise', async () => {
    const result = await factory.close.then(
      () => Promise.reject(new Error('factory.close should not resolve')),
      error => Object.assign(error, {args: '[REDACTED]'})
    )

    expect(sanitizeError(result)).toMatchSnapshot()
  })

  it('exit promise', async () => {
    const result = await factory.exit.then(
      () => Promise.reject(new Error('factory.close should not resolve')),
      error => Object.assign(error, {args: '[REDACTED]'})
    )

    expect(sanitizeError(result)).toMatchSnapshot()
  })
})
