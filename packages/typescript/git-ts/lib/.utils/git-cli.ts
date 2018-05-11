import {
  spawnSync,
  SpawnSyncOptions
} from 'child_process'

export function execute (
  repo: execute.Repo,
  args: execute.Argv,
  options: execute.Options = {}
): execute.Result {
  const res = spawnSync(
    'git',
    Array.from(args),
    {
      ...options,
      encoding: 'utf8',
      cwd: repo
    }
  )

  const {error, status, signal, stderr, stdout} = res

  if (error) throw error

  if (status) {
    throw new execute.ExecutionError(status, signal, stderr)
  }

  return stdout
}

export namespace execute {
  export type Repo = string
  export type Argv = ReadonlyArray<string>
  export type Options = SpawnSyncOptions
  export type Result = string

  export class ExecutionError extends Error {
    readonly name = 'ExecutionError'
    readonly status: number
    readonly signal: string
    readonly stderr: string

    constructor (status: number, signal: string, stderr: string) {
      super(`Status code is ${status}, signal is ${signal}`)
      this.status = status
      this.signal = signal
      this.stderr = stderr
    }
  }
}

export default execute
