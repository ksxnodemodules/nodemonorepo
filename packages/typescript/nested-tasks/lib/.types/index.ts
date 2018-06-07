import * as childProcess from 'child_process'
import shCmd from 'sh-or-cmd'
import {Traverse} from 'fs-tree-utils'
import TraversalDeepFuncParam = Traverse.Options.DeepFunc.Param

import {
  TaskParam,
  TaskSetManifest,
  DependencyList
} from '../../api'

export namespace Manifest {
  export interface Descriptor extends TraversalDeepFuncParam {
    readonly type: Type
  }

  export type Type = 'module' | 'yaml'
}

export class Task {
  static readonly shell: string = shCmd

  //@ts-ignore
  readonly before: DependencyList

  //@ts-ignore
  readonly parallel: DependencyList

  //@ts-ignore
  readonly after: DependencyList

  //@ts-ignore
  readonly command: Task.Command

  //@ts-ignore
  readonly execute: Task.Executor

  constructor (info: TaskParam) {
    type TpsShell = TaskParam.Shortcut.Shell
    type TpsFunction = TaskParam.Shortcut.Function

    switch (typeof info) {
      case 'string':
        return new this.Task({type: 'shell', cmd: info as TpsShell})

      case 'function':
        return new this.Task({type: 'function', execute: info as TpsFunction})

      case 'object':
        break // main branch: below

      default:
        throw new TypeError(`Invalid type of info: ${JSON.stringify(info)}`)
    }

    if (Array.isArray(info)) {
      const [program, ...argv] = info
      return new Task({type: 'spawn', program, argv})
    }

    {
      this.before = createDependencyList('before')
      this.parallel = createDependencyList('parallel')
      this.after = createDependencyList('after')

      function createDependencyList (name: keyof TaskParam.utils.Base): DependencyList {
        const array = (info as TaskParam.utils.Base)[name] || []

        if (!Array.isArray(array)) {
          throw new TypeError(`Property '${name}' is not an array: ${JSON.stringify(array)}`)
        }

        const result = Array<DependencyList.TaskName>()

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

    const infoAsObject = info as TaskParam.Detailed | TaskParam.Keyword

    if ('type' in infoAsObject) {
      type Shell = TaskParam.Detailed.Shell
      type Spawn = TaskParam.Detailed.Spawn
      type Function = TaskParam.Detailed.Function

      const {type} = infoAsObject

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
          } = infoAsObject as Shell

          if (typeof shell !== 'string') {
            throw new TypeError(`Property 'shell' is not a string: ${JSON.stringify(shell)}`)
          }

          if (typeof cmd !== 'string') {
            throw new TypeError(`Property 'cmd' is not a string: ${JSON.stringify(cmd)}`)
          }

          if (typeof oncreate !== 'function') {
            throw new TypeError(`Property 'oncreate' is not a function: ${JSON.stringify(oncreate)}`)
          }

          this.command = {type, shell, cmd, options, oncreate}

          this.execute = createChildProcessExecutor(
            () => childProcess.spawn(shell, [], {...options}),
            x => {
              x.stdin.end(shell + '\n')
              oncreate(x)
            }
          )

          return
        }

        case 'spawn': {
          const {
            program,
            argv,
            options,
            oncreate = () => {}
          } = infoAsObject as Spawn

          if (typeof program !== 'string') {
            throw new TypeError(`Property 'program' is not a string: ${JSON.stringify(program)}`)
          }

          if (!Array.isArray(argv)) {
            throw new TypeError(`Property 'argv' is not an array: ${JSON.stringify(argv)}`)
          }

          if (typeof oncreate !== 'function') {
            throw new TypeError(`Property 'oncreate' is not a function: ${JSON.stringify(oncreate)}`)
          }

          this.command = {type, program, argv, options, oncreate}

          this.execute = createChildProcessExecutor(
            () => childProcess.spawn(program, argv, {...options}),
            oncreate
          )

          return
        }

        case 'function': {
          const {execute} = infoAsObject as Function

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

        //@ts-ignore Unreachable
        throw new TypeError(`Invalid type of info: ${JSON.stringify(infoAsObject)} (${typeof infoAsObject})`)

        function createChildProcessExecutor (
          fn: () => childProcess.ChildProcess,
          oncreate: TaskParam.Detailed.utils.ChildProcess.CreationHandler
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
    }

    if ('cmd' in infoAsObject) {
      return new this.Task({type: 'shell', ...infoAsObject})
    }

    if ('spawn' in infoAsObject) {
      const {spawn, ...rest} = infoAsObject

      if (!Array.isArray(spawn)) {
        throw new TypeError(`Property 'spawn' is not an array: ${JSON.stringify(spawn)}`)
      }

      const [program, ...argv] = spawn
      return new this.Task({type: 'spawn', program, argv, ...rest})
    }

    if ('execute' in infoAsObject) {
      return new this.Task({type: 'function', ...infoAsObject})
    }

    if ('program' in infoAsObject) {
      const {program, argv = [], ...rest} = infoAsObject

      if (typeof program !== 'string') {
        throw new TypeError(`Property 'program' is not a string: ${JSON.stringify(program)}`)
      }

      if (!Array.isArray(argv)) {
        throw new TypeError(`Property 'argv' is not an array: ${JSON.stringify(argv)}`)
      }

      return new this.Task({type: 'spawn', program, argv, ...rest})
    }

    throw new TypeError(`Invalid set of properties: ${JSON.stringify(Object.keys(info))}`)
  }

  get Task () {
    return this.constructor as typeof Task
  }
}

export namespace Task {
  export type Command =
    Command.Shell |
    Command.Spawn |
    Command.Function

  export namespace Command {
    import api = TaskParam.Detailed

    export interface Shell extends api.Shell {
      readonly type: 'shell'
      readonly shell: string
      readonly cmd: string
    }

    export interface Spawn extends api.Spawn {
      readonly type: 'spawn'
      readonly program: string
      readonly argv: ReadonlyArray<string>
    }

    export interface Function extends api.Function {
      readonly type: 'function'
      readonly execute: () => void
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

  constructor (manifest: TaskSetManifest) {
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
          tasks[name] = new Task(info as TaskParam)
          break
        case classifyPropertyName.Result.Subtask:
          subtasks[name.slice(1)] = new TaskSet(info as TaskSetManifest)
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
