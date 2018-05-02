import {
  CommandModule,
  Options,
  Argv
} from 'yargs'

import cmdWrite from './cmd/write'

function builder (yargs: Argv): Argv {
  return yargs
    .command(cmdWrite)
}

export default {
  command: 'manifest <cmd> [args]',
  describe: 'Manage package manifest files',
  builder
} as CommandModule
