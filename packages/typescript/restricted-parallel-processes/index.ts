import * as childProcess from 'child_process'
import actions from 'restricted-concurrent-actions'

/**
 * Spawn a certain number of parallel subprocesses after subprocesses
 * @param params List of parameters
 * @param partLength Number of parallel subprocesses to be spawn at once
 * @param handleRemain Handle final remaining parameters
 * @returns An `AsyncIterableIterator` of arrays
 */
export function spawn (
  params: spawn.ParamList,
  partLength: spawn.PartLength,
  handleRemain?: spawn.RemainingHandler
): spawn.ReturningPromise {
  return actions(spawn.getActionList(params), partLength, handleRemain)
}

export namespace spawn {
  export type ParamList = ReadonlyArray<ParamItem>
  export type ParamItem = string | ArgvParams | ObjectParams
  export type ArgvParams = ReadonlyArray<string>
  export type PartLength = actions.PartLength
  export type Action = actions.Action<ResultItem>
  export type ActionList = actions.ActionList<ResultItem>
  export type RemainingHandler = actions.RemainingHandler<ResultItem>
  export type ReturningPromise = actions.ReturningPromise<ResultItem>
  export type ReturningValue = actions.ReturningValue<ResultItem>
  export type ChildProcess = childProcess.ChildProcess

  export const {
    OMIT_EMPTY_REMAINING_PART,
    KEEP_REMAINING_PART,
    OMIT_REMAINING_PART,
    DEFAULT_REMAINING_HANDLER
  } = actions

  export interface ObjectParams {
    /**
     * Program name to execute
     * @see https://nodejs.org/api/child_process.html
     */
    readonly command: string

    /**
     * Arguments to pass to program
     * @see https://nodejs.org/api/child_process.html
     */
    readonly argv?: ReadonlyArray<string>

    /**
     * Spawning options
     * @see https://nodejs.org/api/child_process.html
     */
    readonly options?: childProcess.SpawnOptions

    /**
     * Function that will be called upon child process creation
     */
    readonly oncreate?: ObjectParams.CreationEventHandler
  }

  export namespace ObjectParams {
    export type CreationEventHandler = (process: ChildProcess) => void
  }

  export class ResultItem {
    /**
     * Created child process
     * @see https://nodejs.org/api/child_process.html
     */
    readonly process: ChildProcess

    /**
     * Returning exit status code
     * @see https://nodejs.org/api/child_process.html
     */
    readonly status: number

    /**
     * Exit signal
     * @see https://nodejs.org/api/child_process.html
     */
    readonly signal: string | null | void

    /**
     * Received stdout chunks
     */
    readonly stdout: ResultItem.DataChunkList

    /**
     * Received stderr chunks
     */
    readonly stderr: ResultItem.DataChunkList

    constructor (
      process: ChildProcess,
      status: number,
      signal: string | null | void,
      stdout: ResultItem.DataChunkList,
      stderr: ResultItem.DataChunkList
    ) {
      this.process = process
      this.status = status
      this.signal = signal
      this.stdout = stdout
      this.stderr = stderr
    }
  }

  export namespace ResultItem {
    export type DataChunkList = ReadonlyArray<DataChunk>
    export type DataChunk = Buffer | string
  }

  export class DisconnectionException extends Error {
    readonly process: ChildProcess
    readonly params: ObjectParams

    constructor (process: ChildProcess, params: ObjectParams) {
      const {command, argv = []} = params
      const execstr = [command, ...argv].join(' ')
      super(`Process of command '${execstr}' disconnected.`)
      this.process = process
      this.params = params
    }

    get name () {
      return this.constructor.name
    }
  }

  export function getActionList (params: ParamList): ActionList {
    return params.map(getObjectParam).map(getActionFunction)
  }

  export function getObjectParam (item: ParamItem): ObjectParams {
    switch (typeof item) {
      case 'string':
        return getObjectParam(
          String(item).split(' ').filter(x => x.trim())
        )
      case 'object':
        if (!item) throw new TypeError(`null is not a valid item`)

        if (Array.isArray(item)) {
          const [command, ...argv] = item as ArgvParams
          return {command, argv}
        }

        return item as ObjectParams
      default:
        throw new TypeError('Invalid type of item')
    }
  }

  export function getActionFunction (params: ObjectParams): Action {
    const {
      command,
      argv = [],
      options = {},
      oncreate = () => {}
    } = params

    return () => new Promise((resolve, reject) => {
      const process = childProcess.spawn(command, Array.from(argv), options)
      oncreate(process)

      let stdout = Array<ResultItem.DataChunk>()
      let stderr = Array<ResultItem.DataChunk>()
      process.stdout.on('data', chunk => stdout.push(chunk))
      process.stderr.on('data', chunk => stderr.push(chunk))

      process
        .on('error', error => reject(error))
        .on('disconnect', () => reject(new DisconnectionException(process, params)))
        .on('close', (status, signal) => resolve(new ResultItem(process, status, signal, stdout, stderr)))
    })
  }

  /**
   * Like `spawn`, but returns a `Promise` of arrays
   * @param params List of parameters
   * @param partLength Number of parallel subprocesses to be spawn at once
   * @param handleRemain Handle final remaining parameters
   * @returns A `Promise` of arrays
   */
  export function asArray (
    params: ParamList,
    partLength: PartLength,
    handleRemain?: RemainingHandler
  ): asArray.ReturningPromise {
    return actions.asArray(getActionList(params), partLength, handleRemain)
  }

  export namespace asArray {
    export type ReturningPromise = actions.asArray.ReturningPromise<ResultItem>
    export type ReturningValue = actions.asArray.ReturningValue<ResultItem>
  }
}

export default spawn
