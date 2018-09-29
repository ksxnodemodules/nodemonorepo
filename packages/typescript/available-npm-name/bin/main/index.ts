import process from 'process'
import ramda from 'ramda'
import yargs from 'yargs'
import check, { Status } from '../../index'

const { argv } = yargs
  .usage('$0 [names]')
  .options({
    registry: {
      alias: 'r',
      describe: 'Configure registry',
      type: 'string',
      demandOption: false
    },
    format: {
      alias: 'f',
      describe: 'Output format',
      choices: ['text', 'json'],
      default: 'text'
    },
    jsonIndent: {
      describe: 'JSON Indentation',
      type: 'number',
      default: 2
    }
  })
  .help()

const {
  registry,
  format,
  jsonIndent,
  _: names
} = argv as {
  registry?: string,
  format: 'text' | 'json',
  jsonIndent: number
} & typeof argv

if (!names.length) {
  console.error('Provide at least 1 argument')
  process.exit(2)
}

check(names, registry).then(
  statuses => {
    if (statuses === Status.InvalidRegistry) {
      if (format === 'json') {
        console.info(JSON.stringify({
          ok: false,
          error: 'Invalid Registry'
        }))
      }

      if (format === 'text') {
        console.error('[ERROR] Invalid Registry')
        process.exit(2)
      }

      return
    }

    const results = ramda.zip(names, statuses)

    if (format === 'json') {
      const content = results.map(([name, status]) => ({ name, response: Status[status] }))
      console.info(JSON.stringify(({ ok: true, content }), undefined, jsonIndent))
      return
    }

    if (format === 'text') {
      interface StrMap {
        [_: string]: string
      }

      const prefix: StrMap = {
        [Status.Available]: '✅',
        [Status.Occupied]: '❌',
        [Status.InvalidName]: '👎',
        [Status.NetworkError]: '❓'
      }

      const suffix: StrMap = {
        [Status.Available]: 'is available',
        [Status.Occupied]: 'is occupied',
        [Status.InvalidName]: 'is an invalid name',
        [Status.NetworkError]: 'ran into a network error'
      }

      for (const [name, status] of results) {
        console.info(prefix[status] + ' ' + name + ' ' + suffix[status])
      }

      return
    }
  },
  error => {
    console.error(error)
    process.exit(1)
  }
)
