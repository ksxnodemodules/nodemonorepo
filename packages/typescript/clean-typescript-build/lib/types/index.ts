import {Traverse} from 'fs-tree-utils'

export type DeepFunc = Traverse.Options.DeepFunc
export type SourceDetector = (x: Param) => boolean
export type TargetSpecifier = (x: Param) => TargetList
export type Param = Traverse.Options.DeepFunc.Param
export type TargetList = ReadonlyArray<string>

export interface Options {
  readonly deep?: DeepFunc
  readonly isSource?: SourceDetector
  readonly listTargets?: TargetSpecifier
}

export namespace Clean {
  export interface Result {
    readonly targets: Result.FileList
    readonly reports: Result.ReportList
    readonly success: Result.FileList
    readonly failure: Result.FileList
  }

  export namespace Result {
    export type FileList = ReadonlyArray<string>
    export type ReportList = ReadonlyArray<Report>

    export interface Report {
      readonly file: string
      readonly deletion: Report.Deletion
    }

    export namespace Report {
      export type Deletion = Deletion.Success | Deletion.Failure

      export namespace Deletion {
        export interface Success {
          readonly success: true
        }

        export interface Failure {
          readonly success: false
          readonly error: any
        }
      }
    }
  }
}
