import { spawnSync } from 'child_process'
import { SpawnSyncRepresentative } from '../../classes'

export = (cmd: string, ...argv: string[]) =>
  new SpawnSyncRepresentative(spawnSync(cmd, argv, { stdio: 'inherit' }))
