import Base from 'advanced-map-base'

import {
  MapLike,
  MapLikeConstructor,
  InitFunc
} from 'advanced-map-types'

/**
 * Objects of this class call their `init` function
 * every time`get()`is invoked upon non-existing key.
 * As a result, `get()` never return `undefined`.
 */
class Initialized<
  Key,
  Value,
  Data extends MapLike<Key, Value> = Map<Key, Value>
> extends Base<Key, Value, Data> {
  private readonly init: InitFunc<Key, Value>

  /**
   * @param Map A constructor (a.k.a class) that creates a Map-like object.
   * @param init Function that takes a yet-to-initialized key and returns default value.
   */
  constructor (
    Map: MapLikeConstructor<Data>,
    init: InitFunc<Key, Value>
  ) {
    super(Map)
    this.init = init
  }

  /**
   * Check if a certain key is initialized/set.
   * @returns `true` if given key is initialized or set, `false` otherwise.
   */
  public has (key: Key): boolean {
    return this.data.has(key)
  }

  /**
   * If `key` exists, return corresponding value.
   * Otherwise, call `init` function and add its returning value to the map.
   * @param key Map's key.
   * @returns Corresponding value.
   */
  public get (key: Key): Value {
    const { data } = this
    if (data.has(key)) return data.get(key) as Value
    const value = this.init(key)
    data.set(key, value)
    return value
  }

  /**
   * Set `key` to point to `value`.
   * @param key Key.
   * @param value Value.
   */
  public set (key: Key, value: Value): void {
    this.data.set(key, value)
  }

  /**
   * Delete a key if it exists.
   * @param key Key to be deleted.
   * @returns `true` if deleted key existed and `false` otherwise.
   */
  public delete (key: Key): boolean {
    return this.data.delete(key)
  }
}

export = Initialized
