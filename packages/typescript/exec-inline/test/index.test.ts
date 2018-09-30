import childProcess from 'child_process'
import process from 'process'
import spawnSync, { SpawnSyncRepresented } from '../index'

it('matches snapshot', () => {
  const info: { [_: string]: any } = {}

  const spySpawnSync = jest
    .spyOn(childProcess, 'spawnSync')
    .mockImplementation((...args): SpawnSyncRepresented => {
      info.spawnSyncArgs = args
      return { status: 123 }
    })

  const spyProcessExit = jest
    .spyOn(process, 'exit')
    .mockImplementation((...args) => {
      info.processExitArgs = args
    })

  const representative = spawnSync('arg0', 'arg1', 'arg2', 'arg3')
  info.representative = representative
  representative.exit()

  spySpawnSync.mockClear()
  spyProcessExit.mockClear()

  expect(info).toMatchSnapshot()
})
