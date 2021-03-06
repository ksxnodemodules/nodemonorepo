import {
  CommandModule,
  Argv
} from 'yargs'

import outdated from './cmd/outdated'

function builder (yargs: Argv): Argv {
  return yargs
    .command(outdated)
    .demandCommand()
}

export default {
  command: 'dependency-management <cmd> [args]',
  aliases: 'depman',
  describe: 'Manage external dependency versions',
  builder
} as CommandModule
