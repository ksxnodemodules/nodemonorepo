import { SpawnSyncOptions, SpawnSyncReturns, spawnSync } from 'child_process'
import ramda from 'ramda'

export type IOData = Buffer | string
export type OptionalIOData = IOData | null | undefined

const fmtNull = <X>(x: X) =>
  x == null ? null : x

const fmtStdIO = (buf: OptionalIOData): string | null => {
  if (buf == null) return null
  const str = String(buf)
  return str.trim() ? `\n${str}\n` : '((EMPTY))'
}

export type Argv = string[]

export interface SpawnReturns {
  readonly status: number | null
  readonly signal: string | null
  readonly error: Error | null
  readonly stdout: string | null
  readonly stderr: string | null
}

export type SpawnFunc = (argv: Argv, options: SpawnSyncOptions) => SpawnSyncReturns<IOData>

export const createSpawnFunc = (command: string): SpawnFunc => ramda.partial(spawnSync, [command])

export function spawn (
  fn: SpawnFunc,
  argv: Argv = [],
  options: SpawnSyncOptions = {}
): SpawnReturns {
  const { status, signal, error, stdout, stderr } = fn(
    argv,
    options
  )

  return {
    status: fmtNull(status),
    signal: fmtNull(signal),
    error: fmtNull(error),
    stdout: fmtStdIO(stdout),
    stderr: fmtStdIO(stderr)
  }
}

export namespace spawn {
  export const withCommand = (
    command: string,
    argv?: Argv,
    options?: SpawnSyncOptions
  ) => spawn(createSpawnFunc(command), argv, options)
}

export default spawn
