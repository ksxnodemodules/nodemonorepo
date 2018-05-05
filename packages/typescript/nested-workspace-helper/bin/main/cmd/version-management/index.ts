import {
  CommandModule,
  Options,
  Argv
} from 'yargs'

import mismatches from './cmd/mismatches'

function builder (yargs: Argv): Argv {
  return yargs
    .command(mismatches)
    .demandCommand()
}

export default {
  command: 'version-management <cmd> [args]',
  aliases: 'verman',
  describe: 'Manage internal package versions',
  builder
} as CommandModule
