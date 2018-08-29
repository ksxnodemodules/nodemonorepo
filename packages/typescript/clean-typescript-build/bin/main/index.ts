import process from 'process'
import yargs from 'yargs'
import {clean, listAllTargets, Options} from '../../index'

interface CLIArguments extends yargs.Arguments {
  readonly directory: string
  readonly dry: boolean,
  readonly format: 'text' | 'json' | 'none'
  readonly jsonIndent: number
}

const {argv} = yargs
  .usage('$0 <directory> [options]', 'Clean TypeScript compilation products', {
    directory: {
      describe: 'Directory that contains source files',
      type: 'string'
    },
    dry: {
      alias: 'u',
      describe: 'List files without deletion',
      type: 'boolean',
      default: false
    },
    format: {
      alias: 'f',
      describe: 'Format of output to be printed to stdout',
      choices: ['text', 'json', 'none'],
      default: 'text'
    },
    jsonIndent: {
      describe: 'JSON indentation when --format=json',
      type: 'number',
      default: 2
    }
  })
  .help()

const {
  directory,
  dry,
  format,
  jsonIndent
} = argv as CLIArguments

main().then(
  status => process.exit(status),
  error => {
    console.error(error)
    process.exit(1)
  }
)

async function main (): Promise<number> {
  const {success, failure, targets, reports} = await (dry ? fakeClean : clean)(directory)

  if (format === 'text') {
    const list = (filelist: ReadonlyArray<string>) =>
      filelist.forEach(filename => console.info(`  → ${filename}`))

    console.info('TypeScript Cleaner')
    console.info(`\nDetected ${targets.length} files to delete`)

    console.info(`\nDeleted ${success.length} files`)
    list(success)

    console.info(`\nFailed to delete ${failure.length} files`)
    list(failure)

    for (const {file, deletion} of reports) {
      if (deletion.success) continue
      console.error(`\nFailed at ${file}`)
      console.error(deletion.error)
    }
  } else if (format === 'json') {
    const reasons: {
      [filename: string]: any
    } = {}

    for (const {file, deletion} of reports) {
      if (!deletion.success) {
        reasons[file] = deletion.error
      }
    }

    const text = JSON.stringify({targets, success, failure, reasons}, undefined, jsonIndent)
    console.info(text)
  }

  return 0
}

async function fakeClean (directory: string, options?: Options): Promise<clean.Result> {
  const targets = await listAllTargets(directory, options)
  const reports = targets.map(file => ({file, deletion: {success: true as true}}))
  return {success: targets, failure: [], targets, reports}
}
