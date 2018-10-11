import { zip } from 'iter-tools'
import AlteredEqual from 'advanced-map-altered-equal'

import {
  IterableMapLike,
  MapLikeConstructor,
  ElementEqualFunc,
  UnboundedArray
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
    type KeySet = UnboundedArray<Key>

    const equalKeySet = (left: KeySet, right: KeySet): boolean => {
      if (left.length !== right.length) return false

      for (const [a, b] of zip(left, right)) {
        if (!equal(a, b)) return false
      }

      return true
    }

    super(Map, equalKeySet)
  }

  public set (key: Key, value: Value): void {
    super.set(this.cloneKey(key), value)
  }

  /**
   * This method is called in `set()`.
   * @param key Input key.
   * @returns Clone of input key.
   */
  protected abstract cloneKey (key: Key): Key
}

export = MultiKeyBase
