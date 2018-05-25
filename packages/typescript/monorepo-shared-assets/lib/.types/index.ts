export namespace Dict {
  export type StringKeyed<Value> = {
    [key: string]: Value | void
  }

  export type NumberKeyed<Value> = {
    [key: number]: Value | void
  }

  export type StrKey<X> = StringKeyed<X>
  export type NumKey<X> = NumberKeyed<X>
}

export namespace Func {
  export type Comparator<X, Y = X> = (x: X, y: Y) => boolean
}

export namespace PromiseRejectionWrapper {
  export type Main<Param, Result> = (x: Param) => Result | Promise<Result>
  export type RejectionHandler<Param, Result> = (reason: any, param: Param) => Result | Promise<Result>
  export type Result<Param, Success, Failure> = Async<Param, Success> | Async<Param, Success | Failure>
  export type Async<Param, Result> = (x: Param) => Promise<Result>
}

export namespace ErrorThrowingWrapper {
  export type Main<Param, Result> = (x: Param) => Result
  export type ErrorHandler<Param, Result> = (error: any, param: Param) => Result
  export type Result<Param, Success, Failure> = Sync<Param, Success> | Sync<Param, Success | Failure>
  export type Sync<Param, Result> = (x: Param) => Result
}
