import Base from 'advanced-set-base'

import {
  IterableSetLike,
  SetLikeConstructor,
  EqualFunc
} from 'advanced-set-types'

/**
 * This class allows one to alter equality comparision
 */
class AlteredEqual<
  X,
  Data extends IterableSetLike<X> = Set<X>
> extends Base<X, Data> {
  private readonly equal: EqualFunc<X>

  /**
   * @param Map A constructor (a.k.a class) that creates an iterable Set-like object
   * @param equal Function that compares keys, default to `Object.is`
   */
  constructor (
    Set: SetLikeConstructor<Data>,
    equal: EqualFunc<X> = Object.is
  ) {
    super(Set)
    this.equal = equal
  }

  /**
   * Find element that matches `x`.
   * @param x Image of element that need to be found.
   * @returns `{ found: boolean, value?: X }` with `value` being matching element.
   */
  public find (x: X): AlteredEqual.FindingResult<X> {
    const { equal } = this

    for (const value of this.data) {
      if (equal(x, value)) return { found: true, value }
    }

    return { found: false }
  }

  public has (x: X): boolean {
    return this.find(x).found
  }

  public add (x: X): void {
    if (!this.has(x)) this.data.add(x)
  }

  public delete (x: X): boolean {
    const res = this.find(x)

    if (res.found) {
      this.data.delete(res.value)
      return true
    }

    return false
  }
}

namespace AlteredEqual {
  export type FindingResult<Value> =
    FindingResult.NotFound |
    FindingResult.Found<Value>

  export namespace FindingResult {
    export interface NotFound {
      readonly found: false
    }

    export interface Found<Value> {
      readonly found: true
      readonly value: Value
    }
  }
}

export = AlteredEqual
