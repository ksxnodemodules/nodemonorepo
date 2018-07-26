export interface QueryObject<Value> {
  readonly [key: string]: Value
}

export enum Generator {
  integer = 'integer',
  sequence = 'sequence',
  string = 'string'
}

export enum Base {
  binary = 2,
  octal = 8,
  hexadecimal = 16,
  decimal = 10
}

export enum Format {
  html = 'html',
  plain = 'plain'
}

export enum Activation {
  on = 'on',
  off = 'off'
}

enum NumBound {
  min = 1,
  max = 1000
}

enum EndBound {
  min = -1e9,
  max = 1e9
}

enum ColBound {
  min = 1,
  max = 1e9
}

enum LenBound {
  min = 1,
  max = 20
}

export namespace ranges {
  export namespace integer {
    export const num = NumBound
    export const min = EndBound
    export const max = EndBound
    export const col = ColBound
    export const base = Base
    export const format = Format
  }

  export namespace sequence {
    export const min = EndBound
    export const max = EndBound
    export const col = ColBound
    export const format = Format
  }

  export namespace string {
    export const num = NumBound
    export const len = LenBound
    export const digits = Activation
    export const upperalpha = Activation
    export const loweralpha = Activation
    export const unique = Activation
    export const format = Format
  }
}

export namespace structured {
  export type Param =
    Param.Integer |
    Param.Sequence |
    Param.String

  export namespace Param {
    export interface Integer {
      readonly num: number
      readonly min: number
      readonly max: number
    }

    export interface Sequence {
      readonly min: number
      readonly max: number
    }

    export type String =
      String.DigitsRequired |
      String.UpperAlphaRequired |
      String.LowerAlphaRequired

    export namespace String {
      export interface Common {
        readonly num: number
        readonly len: number
        readonly unique?: Activation
        readonly digits?: Activation
        readonly upperalpha?: Activation
        readonly loweralpha?: Activation
      }

      export interface DigitsRequired extends Common {
        readonly digits: Activation.on
      }

      export interface UpperAlphaRequired extends Common {
        readonly upperalpha: Activation.on
      }

      export interface LowerAlphaRequired extends Common {
        readonly loweralpha: Activation.on
      }
    }
  }
}

export namespace raw {
  export type Param =
    Param.Integer |
    Param.Sequence |
    Param.String

  export namespace Param {
    export type Integer = structured.Param.Integer & {
      readonly col: number,
      readonly base: Base,
      readonly format: Format
    }

    export type Sequence = structured.Param.Sequence & {
      readonly col: number,
      readonly format: Format
    }

    export type String = structured.Param.String & {
      readonly format: Format
    }
  }
}
