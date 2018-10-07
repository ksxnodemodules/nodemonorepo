import { zip } from 'iter-tools'
import AlteredEqual from '../alterned-equal'

import {
  IterableMapLike,
  MapLikeConstructor,
  ElementEqualFunc,
  UnboundedArray
} from '../../types'

/**
 * This class uses multi keys
 */
class MultiKey<
  Key extends any[],
  Value,
  Data extends IterableMapLike<Key, Value>
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
}

export = MultiKey
