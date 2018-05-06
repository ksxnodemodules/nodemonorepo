import {
  CommandModule,
  Argv
} from 'yargs'

import cmdSync from './cmd/sync'
import cmdWrite from './cmd/write'

function builder (yargs: Argv): Argv {
  return yargs
    .command(cmdSync)
    .command(cmdWrite)
}

export default {
  command: 'manifest <cmd> [args]',
  describe: 'Manage package manifest files',
  builder
} as CommandModule
