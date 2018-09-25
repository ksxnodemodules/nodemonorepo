import {SpawnOptions} from 'child_process'

export interface IsomorphicSpawn<Return extends IsomorphicSpawn.Return> {
  (command: string, args: string[], options: SpawnOptions): Return
}

export namespace IsomorphicSpawn {
  export interface Return {
    on (event: 'close' | 'exit', listener: (status: number, signal: string | null) => void): void
    on (event: 'error', listener: (error: Error) => void): void
    stdout: Readable
    stderr: Readable
  }

  export interface Readable {
    on (event: 'data', listener: (chunk: Buffer) => void): void
  }
}

export interface SpawnFactory<Process extends IsomorphicSpawn.Return> {
  readonly onexit: () => SpawnFactory.TerminationPromise<Process>
  readonly onclose: () => SpawnFactory.TerminationPromise<Process>
  readonly exit: SpawnFactory.TerminationPromise<Process>
  readonly close: SpawnFactory.TerminationPromise<Process>
  readonly process: Process
}

export namespace SpawnFactory {
  export type TerminationPromise<Process extends IsomorphicSpawn.Return> =
    Promise<TerminationInformation<Process>>

  export interface TerminationInformation<Process extends IsomorphicSpawn.Return> {
    readonly command: string
    readonly args: string[]
    readonly options: SpawnOptions
    readonly stdout: string
    readonly stderr: string
    readonly output: string
    readonly status: number
    readonly signal: string | null
    readonly process: Process
  }
}
