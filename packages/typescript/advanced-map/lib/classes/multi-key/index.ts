import { zip } from 'iter-tools'
import AlteredEqual from '../alterned-equal'

import {
  IterableMapLike,
  MapLikeConstructor,
  ElementEqualFunc,
  UnboundedArray
} from '../../types'

class MultiKey<
  Key extends any[],
  Value,
  Data extends IterableMapLike<Key, Value>
> extends AlteredEqual<Key, Value, Data> {
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
