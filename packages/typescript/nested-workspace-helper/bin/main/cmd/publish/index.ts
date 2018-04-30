import {
  Argv,
  Arguments,
  Options,
  CommandModule
} from 'yargs'

import checkPublishability from '../../../../lib/npm-registry'
import listAllInvalidPackages from '../../../../lib/list-pkgs'

function builder (yargs: Argv): Argv {
  return yargs
    .positional('directory', {
      describe: 'Directory that contains all packages',
      type: 'string'
    })
    .options({
      dry: {
        alias: 'd',
        describe: 'Run without publishing packages',
        type: 'boolean',
        default: false
      },
      registry: {
        describe: 'Registry for checking publishability and publishing packages',
        type: 'string',
        default: checkPublishability.REGISTRIES.NPM
      }
    })
}

function handler ({
  directory,
  dry,
  registry
}: Arguments & {
  directory: string,
  dry: boolean,
  registry: string
}) {

}

export default {
  command: 'publish <directory>',
  describe: 'Publishing packages',
  builder,
  handler
} as CommandModule
