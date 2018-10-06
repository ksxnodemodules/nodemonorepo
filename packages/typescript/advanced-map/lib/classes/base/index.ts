import {
  MapLikeConstructor,
  MapLike
} from '../../types'

abstract class Base<Key, Value, Data extends MapLike<Key, Value>> implements MapLike<Key, Value> {
  protected readonly data: Data
  public abstract has (key: Key): boolean
  public abstract get (key: Key): Value | undefined
  public abstract set (key: Key, value: Value): void
  public abstract delete (key: Key): boolean

  constructor (Map: MapLikeConstructor<Data>) {
    this.data = new Map()
  }
}

export = Base
