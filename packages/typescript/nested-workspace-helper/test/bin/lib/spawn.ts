import {SpawnSyncOptions} from 'child_process'
import preloadedNode from 'preloaded-node'
import {bin} from './data'

export type IOData = Buffer | string
export type OptionalIOData = IOData | null | undefined

const fmtNull = <X>(x: X) =>
  x == null ? null : x

const fmtStdIO = (buf: OptionalIOData): string | null => {
  if (buf == null) return null
  const str = String(buf)
  return str.trim() ? `\n${str}\n` : '((EMPTY))'
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
    status: fmtNull(status),
    signal: fmtNull(signal),
    error: fmtNull(error),
    stdout: fmtStdIO(stdout),
    stderr: fmtStdIO(stderr)
  }
}
