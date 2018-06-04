import * as childProcess from 'child_process'

export type TaskParam =
  TaskParam.Shortcut |
  TaskParam.Keyword |
  TaskParam.Detailed

export namespace TaskParam {
  export type Shortcut =
    Shortcut.Shell |
    Shortcut.Spawn |
    Shortcut.Function

  export namespace Shortcut {
    export type Shell = string
    export type Spawn = ReadonlyArray<string>
    export type Function = () => void
  }

  export type Keyword =
    Keyword.Shell |
    Keyword.Spawn |
    Keyword.Function

  export namespace Keyword {
    export interface Shell extends utils.Base {
      readonly cmd: string
    }

    export interface Spawn extends utils.Base {
      readonly spawn: ReadonlyArray<string>
    }

    export interface Function extends utils.Base {
      readonly execute: Shortcut.Function
    }
  }

  export type Detailed =
    Detailed.Shell |
    Detailed.Spawn |
    Detailed.Function

  export namespace Detailed {
    export interface Shell extends utils.ChildProcess, TaskParam.utils.Base {
      readonly type?: 'shell'
      readonly shell?: string
      readonly cmd: string
    }

    export interface Spawn extends utils.ChildProcess, TaskParam.utils.Base {
      readonly type?: 'spawn'
      readonly program: string
      readonly argv?: ReadonlyArray<string>
    }

    export interface Function extends TaskParam.utils.Base {
      readonly type?: 'function'
      readonly execute: Shortcut.Function
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

  export namespace utils {
    export interface Base {
      readonly before?: DependencyList.Param
      readonly parallel?: DependencyList.Param
      readonly after?: DependencyList.Param
    }
  }
}

export interface TaskSetManifest {
  readonly [name: string]: TaskParam | TaskSetManifest
}

export type DependencyList = ReadonlyArray<DependencyList.TaskName>

export namespace DependencyList {
  export type TaskName = ReadonlyArray<string>
  export type Param = ReadonlyArray<TaskName | string>
}
