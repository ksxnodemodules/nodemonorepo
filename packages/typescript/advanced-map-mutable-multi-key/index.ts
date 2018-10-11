import Base from 'advanced-map-multi-key-base'
import { IterableMapLike } from 'advanced-map-types'

/**
 * This class uses multiple keys
 */
class MutableMultiKey<
  Key extends any[],
  Value,
  Data extends IterableMapLike<Key, Value> = Map<Key, Value>
> extends Base<Key, Value, Data> {
  protected cloneKey (key: Key): Key {
    return key
  }
}

export = MutableMultiKey
