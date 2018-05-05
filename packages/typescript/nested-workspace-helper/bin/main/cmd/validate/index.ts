import * as process from 'process'
import listAllInvalidPackages from '../../../../lib/invalids'
import {deserialize} from '../../../../lib/utils/json'
import {getDict, getString} from '../../lib/ivls-cvts'

import {
  Argv,
  Arguments,
  Options,
  CommandModule
} from 'yargs'

function builder (yargs: Argv): Argv {
  return yargs
    .positional('directory', {
      describe: 'Directory that contains all packages',
      type: 'string'
    })
    .options({
      jsonOutput: {
        describe: 'Whether output should be json',
        type: 'boolean',
        default: false
      },
      jsonOutputIndent: {
        describe: 'JSON output indentation when --jsonOutput is provided',
        type: 'number',
        default: 2
      },
      noExitStatus: {
        describe: 'Do not exit with code 1 when there are invalid packages',
        type: 'boolean',
        default: false
      }
    })
}

function handler ({
  directory,
  jsonOutput,
  jsonOutputIndent,
  noExitStatus
}: Arguments & {
  directory: string,
  jsonOutput: boolean,
  jsonOutputIndent: number,
  noExitStatus: boolean
}) {
  main().then(
    () => process.exit(0),
    error => {
      console.error(error)
      process.exit(1)
    }
  )

  async function main () {
    const invalids = await listAllInvalidPackages(directory)

    console.info(
      jsonOutput
        ? deserialize(getDict.simple(invalids), jsonOutputIndent)
        : getString(invalids)
    )

    if (invalids.length && !noExitStatus) {
      process.exit(1)
    }
  }
}

export default {
  command: 'validate <directory>',
  describe: 'Check for invalid packages',
  builder,
  handler
} as CommandModule
