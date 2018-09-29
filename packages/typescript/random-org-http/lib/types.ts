// tslint:disable:variable-name

export interface QueryObject<Value> {
  readonly [key: string]: Value
}

export enum Generator {
  integers = 'integers',
  sequences = 'sequences',
  strings = 'strings'
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

const __WORKAROUND__ = `
  Don't mind this string,
  this is to workaround typescript namespace import bug.
`

export namespace ranges {
  export namespace integers {
    export const num = NumBound
    export const min = EndBound
    export const max = EndBound
    export const col = ColBound
    export const base = Base
    export const format = Format
    export const __workaround = __WORKAROUND__
  }

  export namespace sequences {
    export const min = EndBound
    export const max = EndBound
    export const col = ColBound
    export const format = Format
    export const __workaround = __WORKAROUND__
  }

  export namespace strings {
    export const num = NumBound
    export const len = LenBound
    export const digits = Activation
    export const upperalpha = Activation
    export const loweralpha = Activation
    export const unique = Activation
    export const format = Format
    export const __workaround = __WORKAROUND__
  }

  export const __workaround = __WORKAROUND__
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

    export type String = utils.StringParam<true, false>

    export const __workaround = __WORKAROUND__
  }

  export const __workaround = __WORKAROUND__
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

    export type String = utils.StringParam<Activation.on, Activation.off> & {
      readonly format: Format
    }

    export const __workaround = __WORKAROUND__
  }

  export const __workaround = __WORKAROUND__
}

export namespace utils {
  export type StringParam<On, Off> =
    StringParam.DigitsRequired<On, Off> |
    StringParam.LowerAlphaRequired<On, Off> |
    StringParam.UpperAlphaRequired<On, Off>

  export namespace StringParam {
    export interface Common<Binary> {
      readonly num: number
      readonly len: number
      readonly unique?: Binary
      readonly digits?: Binary
      readonly upperalpha?: Binary
      readonly loweralpha?: Binary
    }

    export interface DigitsRequired<On, Off> extends Common<On | Off> {
      digits: On
    }

    export interface UpperAlphaRequired<On, Off> extends Common<On | Off> {
      upperalpha: On
    }

    export interface LowerAlphaRequired<On, Off> extends Common<On | Off> {
      loweralpha: On
    }

    export const __workaround = __WORKAROUND__
  }

  export const __workaround = __WORKAROUND__
}
