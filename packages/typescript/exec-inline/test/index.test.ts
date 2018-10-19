import childProcess from 'child_process'
import process from 'process'
import spawnSync, { SpawnSyncRepresented } from '../index'

const spy = ({
  spawnSync,
  exit
}: {
  spawnSync: (cmd: string, args: string[], options: {}) => any,
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
