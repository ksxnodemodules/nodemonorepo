import Base from 'advanced-map-base'
import { FindingResult } from 'convenient-typescript-utilities'

import {
  IterableMapLike,
  MapLikeConstructor,
  EqualFunc
} from 'advanced-map-types'

/**
 * This class allows one to alter equality comparision
 */
class AlteredEqual<
  Key,
  Value,
  Data extends IterableMapLike<Key, Value> = Map<Key, Value>
> extends Base<Key, Value, Data> {
  private readonly equal: EqualFunc<Key>

  /**
   * @param Map A constructor (a.k.a class) that creates an iterable Map-like object
   * @param equal Function that compares keys, default to `Object.is`
   */
  constructor (
    Map: MapLikeConstructor<Data>,
    equal: EqualFunc<Key> = Object.is
  ) {
    super(Map)
    this.equal = equal
  }

  private getEntry (key: Key): FindingResult<Readonly<{ key: Key, value: Value }>> {
    const { equal } = this

    for (const [k, v] of this.data) {
      if (equal(key, k)) {
        return {
          found: true,
          value: {
            key: k,
            value: v
          }
        }
      }
    }

    return {
      found: false
    }
  }

  public has (key: Key): boolean {
    return this.getEntry(key).found
  }

  public get (key: Key): Value | undefined {
    const res = this.getEntry(key)
    return res.found ? res.value.value : undefined
  }

  public set (key: Key, value: Value) {
    const res = this.getEntry(key)
    this.data.set(res.found ? res.value.key : key, value)
  }

  public delete (key: Key) {
    const res = this.getEntry(key)

    if (res.found) {
      this.data.delete(res.value.key)
      return true
    }

    return false
  }
}

export = AlteredEqual
