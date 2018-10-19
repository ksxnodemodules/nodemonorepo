import childProcess from 'child_process'
import process from 'process'
import spawnSync, { SpawnSyncRepresented } from '../index'

const spy = ({
  spawnSync,
  exit
}: {
  spawnSync: (cmd: string, args: string[], options: {}) => SpawnSyncRepresented,
  exit: (status: number) => void
}) => {
  const spySpawnSync = jest
    .spyOn(childProcess, 'spawnSync')
    .mockImplementation(spawnSync)

  const spyProcessExit = jest
    .spyOn(process, 'exit')
    .mockImplementation(exit)

  const restore = () => {
    spySpawnSync.mockRestore()
    spyProcessExit.mockRestore()
  }

  return {
    spySpawnSync,
    spyProcessExit,
    restore
  }
}

it('matches snapshot', () => {
  const info: { [_: string]: any } = {}

  const spyObject = spy({
    spawnSync: (...args: any[]) => {
      info.spawnSyncArgs = args
      return { status: 123 }
    },

    exit: (...args: any[]) => {
      info.processExitArgs = args
    }
  })

  const representative = spawnSync('arg0', 'arg1', 'arg2', 'arg3')
  info.representative = representative
  representative.exit()

  spyObject.restore()

  expect(info).toMatchSnapshot()
})

describe('.exit()', () => {
  enum Status {
    Called = 123,
    Uncalled = 'uncalled'
  }

  const emulate = (condition?: () => boolean) => {
    let status = Status.Uncalled

    const spyObject = spy({
      spawnSync: (): SpawnSyncRepresented => ({ status: Status.Called as Status.Called }),
      exit (x) { status = x }
    })

    spawnSync('__').exit(condition)
    spyObject.restore()

    return status
  }

  it('always call process.exit() when condition is not provided', () => {
    expect(emulate()).toBe(Status.Called)
  })

  it('does not call process.exit() when condition is false', () => {
    expect(emulate(() => false)).toBe(Status.Uncalled)
  })

  it('calls process.exit() when condition is true', () => {
    expect(emulate(() => true)).toBe(Status.Called)
  })
})

describe('.exit.onerror()', () => {
  type Result = 'uncalled' | number

  const emulate = (status: number) => {
    let expectation: Result = 'uncalled'

    const spyObject = spy({
      spawnSync: (): SpawnSyncRepresented => ({ status }),
      exit (received) { expectation = received }
    })

    spawnSync('__').exit.onerror()
    spyObject.restore()

    return expectation
  }

  it('calls process.exit() when status is non-zero', () => {
    expect(emulate(123)).toBe(123)
  })

  it('does not call process.exit() when status is zero', () => {
    expect(emulate(0)).toBe('uncalled')
  })
})

describe('.exit.success()', () => {
  type Result = 'uncalled' | number

  const emulate = (status: number) => {
    let expectation: Result = 'uncalled'

    const spyObject = spy({
      spawnSync: (): SpawnSyncRepresented => ({ status }),
      exit (received) { expectation = received }
    })

    spawnSync('__').exit.onsuccess()
    spyObject.restore()

    return expectation
  }

  it('calls process.exit() when status is zero', () => {
    expect(emulate(0)).toBe(0)
  })

  it('does not call process.exit() when status is non-zero', () => {
    expect(emulate(123)).toBe('uncalled')
  })
})
