export interface MapLike<Key, Value> {
  has (key: Key): boolean
  get (key: Key): Value | undefined
  set (key: Key, value: Value): void
  delete (key: Key): boolean
}

export type IterableMapLike<Key, Value> =
  MapLike<Key, Value> & Iterable<[Key, Value]>

export interface MapLikeConstructor<Instance extends MapLike<any, any>> {
  new (): Instance
}

export type MapLikeKeyValue<Instance extends MapLike<any, any>> =
  Instance extends MapLike<infer Key, infer Value>
    ? { readonly key: Key, readonly value: Value }
    : never

export type EqualFunc<X> = (a: X, b: X) => boolean
