import * as process from 'process'
import {spawnSync} from 'child_process'
import chalk from 'chalk'
import npmRegistry from '../../../../lib/npm-registry'
import listAllPackages from '../../../../lib/list-pkgs'
import getDependencyMap from '../../../../lib/dep-map'
import checkPublisability from '../../../../lib/publishables'
import listAllInvalidPackages from '../../../../lib/invalids'
import {getString as ivls2text} from '../../lib/ivls-cvts'
import {getString as pkgs2text} from '../../lib/list-cvts'

import {
  Argv,
  Arguments,
  CommandModule
} from 'yargs'

enum ExitStatus {
  Success = 0,
  Failure = 1,
  InvalidPackages = 2,
  UnpublishablePackages = 3
}

namespace publisher {
  export function real (cmd: string, cwd: string): Result {
    const {status, error, signal} = spawnSync(
      cmd,
      ['publish'],
      {
        cwd,
        stdio: 'inherit',
        shell: true
      }
    )

    return {status, error, signal}
  }

  export function fake (cmd: string, cwd: string): Result {
    console.info(`Will execute "${cmd} publish" at directory ${cwd}`)
    return {status: 0, error: undefined, signal: undefined}
  }

  export interface Result {
    readonly status: number
    readonly error?: Error
    readonly signal?: string
  }
}

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
      executable: {
        alias: ['publisher', 'command', 'cmd', 'npm'],
        describe: 'Name of executable that will be called using syntax "<executable> publish"',
        type: 'string',
        default: 'npm'
      },
      registry: {
        describe: 'Registry for checking publishability and publishing packages',
        type: 'string',
        default: npmRegistry.REGISTRIES.NPM
      },
      noUnpublishablePackages: {
        describe: 'Emit error when there are unpublishable packages',
        type: 'boolean',
        default: false
      },
      showExitStatus: {
        describe: 'Show meaning of exit status codes',
        type: 'boolean',
        default: false
      }
    })
}

function handler ({
  directory,
  dry,
  executable,
  registry,
  noUnpublishablePackages,
  showExitStatus
}: Arguments & {
  directory: string,
  dry: boolean,
  executable: string,
  registry: string,
  noUnpublishablePackages: boolean,
  showExitStatus: boolean
}) {
  main().then(
    code => process.exit(code),
    error => {
      console.error(error)
      process.exit(ExitStatus.Failure)
    }
  )

  async function main (): Promise<number> {
    if (showExitStatus) {
      console.info(ExitStatus)
      return ExitStatus.Success
    }

    const allPackages = await listAllPackages(directory)
    const depMap = getDependencyMap.fromPackageList(allPackages)
    const invalids = listAllInvalidPackages.fromDependencyMap(depMap)
    const publishability = await checkPublisability.fromPackageList(allPackages, registry)

    // no invalids allowed
    if (invalids.length) {
      console.error('[ERROR] Invalid packages')
      console.info(ivls2text(invalids))
      return ExitStatus.InvalidPackages
    }

    { // when unpublishables exist but not allowed
      const {unpublishables} = publishability

      if (noUnpublishablePackages && unpublishables.length) {
        console.error('[ERROR] Unpublishable packages: Version already exist in registry')
        console.info(pkgs2text(unpublishables))
        return ExitStatus.UnpublishablePackages
      }
    }

    { // publishing packages
      const {publishables} = publishability
      const {length} = publishables

      if (!length) {
        console.info('[INFO] No publishable packages')
        return ExitStatus.Success
      }

      console.info(`${chalk.bold.green(String(length))} packages are going to be published`)
      console.info(pkgs2text(publishables).split('\n').map(x => '* ' + x).join('\n'))
      console.info()

      const publish = dry ? publisher.fake : publisher.real

      let finalStatus = 0

      for (const item of publishables) {
        const {name} = item.manifestContent
        console.info(`Publishing ${chalk.bold(name as string)}...`)
        const {status, error, signal} = publish(executable, item.path)
        if (status || error || signal) console.info('[FAILED]', {status, error, signal})
        finalStatus |= status
      }

      return finalStatus
    }
  }
}

export default {
  command: 'publish <directory>',
  describe: 'Publishing packages',
  builder,
  handler
} as CommandModule
