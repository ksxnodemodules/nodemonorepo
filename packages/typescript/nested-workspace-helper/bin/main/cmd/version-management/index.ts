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

const main: CommandModule = {
  command: 'version-management <cmd> [args]',
  aliases: 'verman',
  describe: 'Manage package versions',
  builder,
  handler () {}
}

export default main
