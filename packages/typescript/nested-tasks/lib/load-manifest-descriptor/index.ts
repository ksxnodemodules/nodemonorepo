import * as childProcess from 'child_process'
import yaml from 'monorepo-shared-yaml'
import {Manifest} from '../.types'

/**
 * @param descriptor A manifest descriptor
 * @returns A task set
 */
export async function loadManifestDescriptor (
  descriptor: Manifest.Descriptor
): Promise<loadManifestDescriptor.TaskSet> {
  const manifest = await loadObject(descriptor)

  if (typeof manifest !== 'object') {
    throw new TypeError(`Manifest is not an object: ${manifest}`)
  }

  if (manifest instanceof Array) {
    throw new TypeError(`Manifest is an array: ${JSON.stringify(manifest)}`)
  }

  if (!manifest) {
    throw new TypeError('Manifest is null')
  }

  return new loadManifestDescriptor.TaskSet(manifest)
}

export namespace loadManifestDescriptor {
  export class Task {
    static readonly shell: string = 'sh'

    //@ts-ignore
    readonly before: Task.DependencyList

    //@ts-ignore
    readonly after: Task.DependencyList

    //@ts-ignore
    readonly command: Task.Command

    //@ts-ignore
    readonly execute: Task.Executor

    constructor (info: any) {
      switch (typeof info) {
        case 'string':
          return new this.Task({type: 'shell', cmd: info})

        case 'function':
          return new this.Task({type: 'function', execute: info})

        case 'object':
          break // main branch: below

        default:
          throw new TypeError(`Invalid type of info: ${JSON.stringify(info)}`)
      }

      if (info instanceof Array) {
        const [program, ...argv] = info
        return new Task({type: 'spawn', program, argv})
      }

      {
        this.before = createDependencyList('before')
        this.after = createDependencyList('after')

        function createDependencyList (name: string): Task.DependencyList {
          const array = info[name] || []

          if (!Array.isArray(array)) {
            throw new TypeError(`Property '${name}' is not an array: ${JSON.stringify(array)}`)
          }

          const result = Array<Task.DependencyList.TaskName>()

          for (const item of array) {
            if (Array.isArray(item)) {
              result.push(item)
              continue
            }

            if (typeof item === 'string') {
              result.push(item.split(/\s|\./))
              continue
            }

            throw new TypeError(`Invalid type of an item: ${JSON.stringify(item)}`)
          }

          return result
        }
      }

      if ('type' in info) {
        const {type} = info

        if (typeof type !== 'string') {
          throw new TypeError(`Property 'type' is not a string: ${JSON.stringify(type)}`)
        }

        switch (type) {
          case 'shell': {
            const {
              shell = this.Task.shell,
              cmd,
              options,
              oncreate = () => {}
            } = info

            if (typeof shell !== 'string') {
              throw new TypeError(`Property 'shell' is not a string: ${JSON.stringify(shell)}`)
            }

            if (typeof cmd !== 'string') {
              throw new TypeError(`Property 'cmd' is not a string: ${JSON.stringify(cmd)}`)
            }

            if (typeof oncreate !== 'function') {
              throw new TypeError(`Property 'oncreate' is not a function: ${JSON.stringify(oncreate)}`)
            }

            const command: Task.Command.Shell = {type, shell, cmd, options, oncreate}
            this.command = command

            this.execute = createChildProcessExecutor(
              () => childProcess.spawn(shell, {...options}),
              oncreate
            )

            return
          }

          case 'spawn': {
            const {
              program,
              argv,
              options,
              oncreate = () => {}
            } = info

            if (typeof program !== 'string') {
              throw new TypeError(`Property 'program' is not a string: ${JSON.stringify(program)}`)
            }

            if (!Array.isArray(argv)) {
              throw new TypeError(`Property 'argv' is not an array: ${JSON.stringify(argv)}`)
            }

            if (typeof oncreate !== 'function') {
              throw new TypeError(`Property 'oncreate' is not a function: ${JSON.stringify(oncreate)}`)
            }

            const command: Task.Command.Spawn = {type, program, argv, options, oncreate}
            this.command = command

            this.execute = createChildProcessExecutor(
              () => childProcess.spawn(program, argv, {...options}),
              oncreate
            )

            return
          }

          case 'function': {
            const {execute} = info

            if (typeof execute !== 'function') {
              throw new TypeError(`Property 'execute' is not a function: ${JSON.stringify(execute)}`)
            }

            this.command = {type, execute}
            this.execute = async () => void await middle()

            async function middle () {
              return execute()
            }

            return
          }
        }

        throw new TypeError(`Invalid type of info: ${JSON.stringify(info)} (${typeof info})`)

        function createChildProcessExecutor (
          fn: () => childProcess.ChildProcess,
          oncreate: Task.Command.utils.ChildProcess.CreationHandler
        ): Task.Executor {
          return () => {
            const cp = fn()
            oncreate(cp)
            return createChildProcessPromise(cp)
          }
        }

        function createChildProcessPromise (cp: childProcess.ChildProcess): Promise<void> {
          return new Promise((resolve, reject) => {
            cp.on('error', error => reject(error))

            cp.on(
              'close',
              (status, signal) => status
                ? reject(new Task.ChildProcessError(status, signal))
                : resolve()
            )
          })
        }
      }

      if ('cmd' in info) {
        return new this.Task({type: 'shell', ...info})
      }

      if ('spawn' in info) {
        const {spawn, ...rest} = info

        if (!Array.isArray(spawn)) {
          throw new TypeError(`Property 'spawn' is not an array: ${JSON.stringify(spawn)}`)
        }

        const [program, ...argv] = spawn
        return new this.Task({type: 'spawn', program, argv, ...rest})
      }

      if ('execute' in info) {
        return new this.Task({type: 'function', ...info})
      }

      throw new TypeError(`Invalid set of properties: ${JSON.stringify(Object.keys(info))}`)
    }

    get Task () {
      return this.constructor as typeof Task
    }
  }

  export namespace Task {
    export type DependencyList = ReadonlyArray<DependencyList.TaskName>

    export namespace DependencyList {
      export type TaskName = ReadonlyArray<string>
    }

    export type Command =
      Command.Shell |
      Command.Spawn |
      Command.Function

    export namespace Command {
      export interface Shell extends utils.ChildProcess {
        readonly type: 'shell'
        readonly shell: string
        readonly cmd: string
      }

      export interface Spawn extends utils.ChildProcess {
        readonly type: 'spawn'
        readonly program: string
        readonly argv: ReadonlyArray<string>
      }

      export interface Function {
        readonly type: 'function'
        readonly execute: () => void
      }

      export namespace utils {
        export interface ChildProcess {
          readonly options?: childProcess.SpawnOptions
          readonly oncreate?: ChildProcess.CreationHandler
        }

        export namespace ChildProcess {
          export type CreationHandler = (x: childProcess.ChildProcess) => void
        }
      }
    }

    export type Executor = () => Promise<void>

    export class ChildProcessError extends Error {
      readonly status: number
      readonly signal: string | null

      constructor (status: number, signal: string | null) {
        super(`Child process exit with code ${status} (signal: ${signal})`)
        this.status = status
        this.signal = signal
      }
    }
  }

  export class TaskSet {
    readonly manifest: object
    readonly tasks: TaskDict
    readonly subtasks: SubtaskDict

    constructor (manifest: object) {
      const tasks: {[_: string]: Task} = {}
      const subtasks: {[_: string]: TaskSet} = {}

      this.manifest = manifest
      this.tasks = tasks
      this.subtasks = subtasks

      for (const [name, info] of Object.entries(manifest)) {
        switch (classifyPropertyName(name)) {
          case classifyPropertyName.Result.Invalid:
            throw new Error(`Invalid name: ${name}`)
          case classifyPropertyName.Result.Task:
            tasks[name] = new Task(info)
            break
          case classifyPropertyName.Result.Subtask:
            subtasks[name] = new TaskSet(info)
            break
        }
      }
    }
  }

  export interface TaskDict {
    readonly [name: string]: Task | void
  }

  export interface SubtaskDict {
    readonly [name: string]: TaskSet | void
  }

  export function classifyPropertyName (name: string): classifyPropertyName.Result {
    const {Result} = classifyPropertyName
    if (/^[a-z-_]+$/i.test(name)) return Result.Task
    if (/^@[a-z-_]+$/i.test(name)) return Result.Subtask
    return Result.Invalid
  }

  export namespace classifyPropertyName {
    export enum Result {
      Invalid,
      Task,
      Subtask
    }
  }
}

async function loadObject (descriptor: Manifest.Descriptor): Promise<any> {
  const {type, path} = descriptor

  switch (type) {
    case 'module':
      return require(path)
    case 'yaml':
      return await yaml.loadFile(path)
  }
}

export default loadManifestDescriptor
