import * as process from 'process'

import {
  CommandModule,
  Options,
  Argv,
  Arguments
} from 'yargs'

import {
  writePackageManifests,
  Package
} from '../../../../../index'

import {serialize} from '../../../../../lib/utils/json'

import {
  getActionFunction,
  ActionChoice
} from '../lib/get-act-fn'

function builder (yargs: Argv) {
  return yargs
    .positional('directory', {
      describe: 'Directory that contains all packages',
      type: 'string'
    })
    .positional('action', {
      describe: 'Action to be taken',
      choices: ['set', 'delete', 'assign']
    })
    .positional('propertyPath', {
      describe: 'Dot separated property path',
      type: 'string'
    })
    .positional('value', {
      describe: 'Value (in JSON/YAML format) to be used when action is "set" or "assign"',
      type: 'string'
    })
    .options({
      propertyPathSeparator: {
        alias: ['seperator', 'sep'],
        describe: 'Separator between property names in property path',
        type: 'string',
        default: '.'
      },
      indentation: {
        alias: 'indent',
        describe: 'Manifest json indentation (number of spaces)',
        type: 'number',
        default: 2
      },
      finalNewLine: {
        describe: 'How many new line to be added to the end of manifest file',
        type: 'number',
        default: 1
      }
    })
}

function handler ({
  directory,
  action,
  propertyPath,
  value,
  propertyPathSeparator,
  indentation,
  finalNewLine
}: Arguments & {
  directory: string,
  action: ActionChoice,
  propertyPath: string,
  value?: string,
  propertyPathSeparator: string,
  indentation: number,
  finalNewLine: number
}) {
  main().then(
    code => process.exit(code),
    error => {
      console.error(error)
      process.exit(1)
    }
  )

  async function main (): Promise<number> {
    const {value: actualValue, error} = getActualValue()

    if (error) {
      console.error(error)
      return 1
    }

    const actualPropertyPath = propertyPath.split(propertyPathSeparator)
    const act = getActionFunction(action)

    await writePackageManifests(
      directory,
      item => act(item.manifestContent, actualPropertyPath, actualValue),
      {
        indentation,
        finalNewLine
      }
    )

    return 0
  }

  function getActualValue () {
    switch (action) {
      case 'set':
      case 'assign':
        return value
          ? {
            error: null,
            value: serialize(value)
          }
          : {
            error: `Value is required when action is '${action}'`,
            value: null
          }
      case 'delete':
        return {error: null, value: null}
    }
  }
}

export default {
  command: 'write <directory> <action> <propertyPath> [value]',
  builder,
  handler
} as CommandModule
