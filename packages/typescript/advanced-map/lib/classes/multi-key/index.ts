import {
  IterableMapLike,
  MapLikeConstructor,
  MapLikeKeyValue,
  EqualFunc
} from '../../types'

import AlteredEqual from '../alterned-equal'

class MultiKey<
  Key extends any[],
  Value,
  Data extends IterableMapLike<Key, Value>
> extends AlteredEqual<Key, Value, Data> {
  constructor ()
}

export = MultiKey
