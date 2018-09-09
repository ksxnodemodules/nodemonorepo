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

export namespace TupleUtils {
  export type SplitFirstOne<Tuple> =
    Tuple extends [infer First, ...(infer Rest)[]] ? [First, Rest[]] : never

  export type FirstElement<Tuple extends utils.Least[1]> =
    SplitFirstOne<Tuple>[0]

  export type ExcludeFirstElement<Tuple extends utils.Least[1]> =
    SplitFirstOne<Tuple>[1]

  export namespace utils {
    export type Least<X = any> = [
      X[],
      [X, ...X[]],
      [X, X, ...X[]],
      [X, X, X, ...X[]]
    ]
  }
}