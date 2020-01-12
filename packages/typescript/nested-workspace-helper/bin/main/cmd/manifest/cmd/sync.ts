import * as path from 'path'
import * as process from 'process'
import * as fsx from 'fs-extra'
import { getPropertyPath } from '@tsfun/object'

import {
  CommandModule,
  Argv,
  Arguments
} from 'yargs'

import {
  writePackageManifests
} from '../../../../../index'

import { serialize } from '../../../../../lib/utils/json'

import {
  getActionFunction,
  ActionChoice
} from '../lib/get-act-fn'

function builder (yargs: Argv): Argv {
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
    .options({
      source: {
        describe: 'Path to a json file or a directory that contain package.json where values come from',
        type: 'string',
        default: '.'
      },
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
  source,
  propertyPathSeparator,
  indentation,
  finalNewLine
}: Arguments & {
  directory: string,
  action: ActionChoice,
  propertyPath: string,
  source: string,
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
    const actualPropertyPath = propertyPath.split(propertyPathSeparator)
    const value = await getValue(actualPropertyPath)
    const act = getActionFunction(action)

    await writePackageManifests(
      directory,
      item => act(item.manifestContent, actualPropertyPath, value),
      {
        indentation,
        finalNewLine
      }
    )

    return 0
  }

  async function getValue (propertyPath: string[]) {
    switch (action) {
      case 'set':
      case 'assign':
        const filename = await getSourceFile()
        const filetext = await fsx.readFile(filename, 'utf8')
        const object = serialize(filetext)
        return getPropertyPath(object, propertyPath)
      case 'delete':
        return undefined
    }
  }

  async function getSourceFile () {
    const stats = await fsx.stat(source)
    if (stats.isFile()) return source
    if (stats.isDirectory()) return path.resolve(source, 'package.json')
    throw new Error('Unknown type of file system')
  }
}

export default {
  command: 'sync <directory> <action> <propertyPath> [args]',
  builder,
  handler
} as CommandModule
