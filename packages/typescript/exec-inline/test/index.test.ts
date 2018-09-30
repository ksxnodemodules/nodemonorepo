import childProcess from 'child_process'
import process from 'process'
import spawnSync, { SpawnSyncRepresented } from '../index'

it('matches snapshot', () => {
  const info: { [_: string]: any } = {}

  const spySpawnSync = jest
    .spyOn(childProcess, 'spawnSync')
    .mockImplementation((...args: any[]): SpawnSyncRepresented => {
      info.spawnSyncArgs = args
      return { status: 123 }
    })

  const spyProcessExit = jest
    .spyOn(process, 'exit')
    .mockImplementation((...args: any[]) => {
      info.processExitArgs = args
    })

  const representative = spawnSync('arg0', 'arg1', 'arg2', 'arg3')
  info.representative = representative
  representative.exit()

  // tslint:disable-next-line:comment-format
  //@ts-ignore
  spySpawnSync.mockRestore()

  // tslint:disable-next-line:comment-format
  //@ts-ignore
  spyProcessExit.mockRestore()

  expect(info).toMatchSnapshot()
})
