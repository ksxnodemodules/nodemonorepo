import Base from 'advanced-map-multi-key-base'
import { IterableMapLike } from 'advanced-map-types'

/**
 * This class uses multiple keys
 */
class MultiKey<
  Key extends any[],
  Value,
  Data extends IterableMapLike<Key, Value> = Map<Key, Value>
> extends Base<Key, Value, Data> {
  protected cloneKey (key: Key): Key {
    return Array.from(key) as Key
  }
}

export = MultiKey
