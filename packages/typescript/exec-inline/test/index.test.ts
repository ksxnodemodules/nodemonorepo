import childProcess from 'child_process'
import process from 'process'
import spawnSync, { SpawnSyncRepresented } from '../index'

it('matches snapshot', () => {
  const info: { [_: string]: any } = {}

  jest
    .spyOn(childProcess, 'spawnSync')
    .mockImplementation((...args): SpawnSyncRepresented => {
      info.spawnSyncArgs = args
      return { status: 123 }
    })

  jest
    .spyOn(process, 'exit')
    .mockImplementation((...args) => {
      info.processExitArgs = args
    })

  const representative = spawnSync('arg0', 'arg1', 'arg2', 'arg3')
  info.representative = representative
  representative.exit()

  expect(info).toMatchSnapshot()
})
