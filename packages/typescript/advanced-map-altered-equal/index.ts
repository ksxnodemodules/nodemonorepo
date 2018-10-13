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

  public find (key: Key): AlteredEqual.Find.Result<Key, Value> {
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
    return this.find(key).found
  }

  public get (key: Key): Value | undefined {
    const res = this.find(key)
    return res.found ? res.value.value : undefined
  }

  public set (key: Key, value: Value): this {
    const res = this.find(key)
    this.data.set(res.found ? res.value.key : key, value)
    return this
  }

  public delete (key: Key): boolean {
    const res = this.find(key)

    if (res.found) {
      this.data.delete(res.value.key)
      return true
    }

    return false
  }
}

namespace AlteredEqual {
  export namespace Find {
    export type Result<Key, Value> = FindingResult<Entry<Key, Value>>
  }

  export interface Entry<Key, Value> {
    readonly key: Key
    readonly value: Value
  }
}

export = AlteredEqual
