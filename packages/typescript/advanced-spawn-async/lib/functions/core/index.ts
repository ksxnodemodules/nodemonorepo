import {SpawnOptions} from 'child_process'
import once from 'exec-once'
import {IsomorphicSpawn, SpawnFactory} from '../../types'
import {SpawnError} from '../../classes'

function callSpawn<
  Process extends IsomorphicSpawn.Return
> (
  spawn: IsomorphicSpawn<Process>,
  command: string,
  args: string[] = [],
  options: SpawnOptions = {}
): SpawnFactory<Process> {
  type Info = SpawnFactory.TerminationInformation<Process>

  const process = spawn(command, args, options)

  let stdout = ''
  let stderr = ''
  let output = ''

  process.stdout.on('data', chunk => {
    stdout += chunk
    output += chunk
  })

  process.stderr.on('data', chunk => {
    stderr += chunk
    output += chunk
  })

  const mkinfo = (status: number, signal: string | null): Info => ({
    command,
    args,
    options,
    stdout,
    stderr,
    output,
    status,
    signal,
    process
  })

  const createEventMaker = (event: 'close' | 'exit') => once(() => {
    return new Promise<Info>((resolve, reject) => process.on(event, (status, signal) => {
      const info = mkinfo(status, signal)

      if (status) {
        reject(new SpawnError(info))
      } else {
        resolve(info)
      }
    }))
  })

  const onclose = createEventMaker('close')
  const onexit = createEventMaker('exit')

  return {
    onclose,
    onexit,
    get close () {
      return onclose()
    },
    get exit () {
      return onexit()
    },
    process
  }
}

export = callSpawn
