import * as process from 'process'
import chalk from 'chalk'

import {
  CommandModule,
  Argv,
  Arguments
} from 'yargs'

import {
  listOutdatedDependencies,
  updateExternalDependencyVersions,
  npmRegistry
} from '../../../../../../index'

import {
  deserialize
} from '../../../../../../lib/utils/json'

function builder (yargs: Argv): Argv {
  return yargs
    .positional('directory', {
      describe: 'Directory that contains all local packages',
      type: 'string'
    })
    .options({
      baseOnInstalled: {
        alias: 'i',
        describe: 'Read versions from node_modules folders instead of package.json files',
        type: 'boolean',
        default: false
      },
      registry: {
        describe: 'Registry for checking publishability and publishing packages',
        type: 'string',
        default: npmRegistry.REGISTRIES.NPM
      },
      update: {
        alias: 'u',
        describe: 'Update dependencies in package.json',
        type: 'boolean',
        default: false
      },
      manifestIndent: {
        describe: 'Indentation of package.json',
        type: 'number',
        default: 2
      },
      outputFormat: {
        alias: 'O',
        describe: 'Output format',
        type: 'string',
        choices: ['quiet', 'text', 'json'],
        default: 'text'
      },
      jsonOutputIndent: {
        describe: 'JSON output indentation',
        type: 'number',
        default: 2
      }
    })
}

function handler ({
  directory,
  baseOnInstalled,
  registry,
  update,
  manifestIndent,
  outputFormat,
  jsonOutputIndent
}: Arguments & {
  directory: string,
  baseOnInstalled: boolean,
  registry: string,
  update: boolean,
  manifestIndent: number,
  outputFormat: 'quiet' | 'text' | 'json',
  jsonOutputIndent: number
}) {
  main().then(
    status => process.exit(status),
    error => {
      console.error(error)
      process.exit(1)
    }
  )

  async function main (): Promise<number> {
    const options = {
      baseOnInstalled,
      registry,
      indentation: manifestIndent
    }

    const outdated = await listOutdatedDependencies(directory, options)

    { // Print out-of-date dependencies
      const transformed = outdated.map(
        ({manifestContent, path, update}) =>
          ({name: manifestContent.name || null, path, update})
      )

      switch (outputFormat) {
        case 'json':
          console.info(deserialize(transformed, jsonOutputIndent))
          break
        case 'text':
          for (const item of transformed) {
            const name = chalk.bold(item.name || '[anonymous]')
            const path = chalk.dim(`(${item.path})`)
            console.info(`* ${name} ${path}`)

            for (const [type, dict] of Object.entries(item.update)) {
              for (const [name, requirement] of Object.entries(dict)) {
                const dimmedType = chalk.dim(`[${type}]`)
                console.info(`  - ${dimmedType} ${name} → ${requirement}`)
              }
            }
          }
          break
        case 'quiet':
          break
      }
    }

    // Update outdated dependencies
    if (update) {
      await updateExternalDependencyVersions.fromList(outdated, options)
    }

    return 0
  }
}

export default {
  command: 'outdated <directory>',
  describe: 'List out-of-date external dependencies',
  builder,
  handler
} as CommandModule
