import {SpawnOptions} from 'child_process'
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

  const createPromise = (event: 'close' | 'exit') => new Promise<Info>((resolve, reject) => {
    process.on(event, (status, signal) => {
      const info = mkinfo(status, signal)

      if (status) {
        reject(new SpawnError(info))
      } else {
        resolve(info)
      }
    })
  })

  const onclose = createPromise('close')
  const onexit = createPromise('exit')

  return {
    onclose,
    onexit,
    process
  }
}

export = callSpawn
