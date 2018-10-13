export namespace SetUtils {
  export type ElementPresenceChecker = <
    Element extends Value,
    Value
  >(
    array: ReadonlyArray<Element>,
    value: Value
  ) => boolean
}

export namespace ObjectUtils {
  export type KeyLister = <
    Object extends GenericObject,
    Key extends keyof Object
  >(object: Object) => ReadonlyArray<Key>

  export type ValLister = <
    Object extends GenericObject,
    Key extends keyof Object
  >(object: Object) => ReadonlyArray<Object[Key]>

  export interface GenericObject {
    [key: string]: any
  }
}

export namespace FunctionUtils {
  export type RecursiveReturn<Return, Args extends any[]> =
    Return |
    ((...args: Args) => RecursiveReturn<Return, Args>)
}

export type FindingResult<Value> =
  FindingResult.NotFound |
  FindingResult.Found<Value>

export namespace FindingResult {
  export interface NotFound {
    readonly found: false
  }

  export interface Found<Value> {
    readonly found: true
    readonly value: Value
  }
}
