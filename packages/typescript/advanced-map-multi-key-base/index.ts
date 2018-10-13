import createArrayEqual from 'create-array-equal'
import AlteredEqual from 'advanced-map-altered-equal'

import {
  IterableMapLike,
  MapLikeConstructor,
  ElementEqualFunc
} from 'advanced-map-types'

/**
 * This class uses multiple keys
 */
abstract class MultiKeyBase<
  Key extends any[],
  Value,
  Data extends IterableMapLike<Key, Value> = Map<Key, Value>
> extends AlteredEqual<Key, Value, Data> {
  /**
   * @param Map A constructor (a.k.a class) that creates an iterable Map-like object
   * @param equal Function that compare keysets' elements, default to `Object.is`
   */
  constructor (
    Map: MapLikeConstructor<Data>,
    equal: ElementEqualFunc<Key> = Object.is
  ) {
    super(Map, createArrayEqual(equal))
  }

  public set (key: Key, value: Value): this {
    super.set(this.cloneKey(key), value)
    return this
  }

  /**
   * This method is called in `set()`.
   * @param key Input key.
   * @returns Clone of input key.
   */
  protected abstract cloneKey (key: Key): Key
}

export = MultiKeyBase
