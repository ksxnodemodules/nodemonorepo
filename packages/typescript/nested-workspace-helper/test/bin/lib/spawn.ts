import {SpawnSyncOptions} from 'child_process'
import preloadedNode from 'preloaded-node'
import {bin} from './data'

export type IOData = Buffer | string
export type OptionalIOData = IOData | null | undefined

const fmtStdIO = (buf: OptionalIOData): string | null => {
  if (buf == null) return null
  if (buf) return `\n${buf}\n`
  return '((EMPTY))'
}

export interface SpawnReturns {
  readonly status: number | null
  readonly signal: string | null
  readonly error: Error | null
  readonly stdout: string | null
  readonly stderr: string | null
}

export default function spawn (
  argv: string[] = [],
  options: SpawnSyncOptions = {}
): SpawnReturns {
  const {status, signal, error, stdout, stderr} = preloadedNode.spawnSync(
    [bin, ...argv],
    options
  )

  return {
    status,
    signal,
    error,
    stdout: fmtStdIO(stdout),
    stderr: fmtStdIO(stderr)
  }
}
