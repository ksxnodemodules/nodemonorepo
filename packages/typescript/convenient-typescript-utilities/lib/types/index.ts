export namespace SetUtils {
  export type  ElementPresenceChecker = <
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
