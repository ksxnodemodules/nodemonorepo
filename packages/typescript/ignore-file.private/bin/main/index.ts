import * as path from 'path'
import * as process from 'process'
import * as yargs from 'yargs'
import {writeIgnoreFiles, createFileChooser} from '../../index'

import {
  Argv,
  Arguments
} from 'yargs'

yargs
  .usage('$0 <cmd> [args]')
  .command({
    command: 'write',
    describe: 'Create ignore files',
    builder: writeBuilder,
    handler: writeHandler
  })
  .demandCommand()
  .env('IGFILEMAN')
  .help()
  .argv

function writeBuilder (yargs: Argv) {
  return yargs.options({
    base: {
      alias: 'B',
      describe: 'Base filename',
      type: 'string',
      demandOption: true
    },
    root: {
      alias: 'R',
      describe: 'Directory contains deltas and outputs',
      type: 'string',
      default: '.'
    },
    output: {
      alias: 'O',
      describe: 'Output basename',
      type: 'string',
      demandOption: true
    },
    delta: {
      alias: 'D',
      describe: 'Delta extensions',
      type: 'string',
      array: true,
      default: ['yaml', 'yml']
    },
    container: {
      alias: 'C',
      describe: 'Glob pattern of containing folders',
      type: 'string',
      default: '**'
    }
  })
}

function writeHandler ({
  base,
  root,
  output,
  delta,
  container
}: Arguments & {
  base: string,
  root: string,
  output: string,
  delta: ReadonlyArray<string>,
  container: string
}): void {
  if (!delta.length) {
    console.error('No delta extensions provided')
    process.exit(2)
  }

  const chooseDeltaFile = createFileChooser.byExt(...delta)

  writeIgnoreFiles(
    base,
    output,
    container,
    root,
    chooseDeltaFile
  ).then(
    () => process.exit(0),
    error => {
      console.error(error)
      process.exit(1)
    }
  )
}
