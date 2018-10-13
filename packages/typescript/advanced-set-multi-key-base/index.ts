import createArrayEqual from 'create-array-equal'
import AlteredEqual from 'advanced-set-altered-equal'

import {
  IterableSetLike,
  SetLikeConstructor,
  ElementEqualFunc
} from 'advanced-set-types'

/**
 * This class contains ordered arrays
 */
abstract class MultiKeyBase<
  X extends any[],
  Data extends IterableSetLike<X> = Set<X>
> extends AlteredEqual<X, Data> {
  /**
   * @param Map A constructor (a.k.a class) that creates an iterable Set-like object
   * @param equal Function that compare keysets' elements, default to `Object.is`
   */
  constructor (
    Set: SetLikeConstructor<Data>,
    equal: ElementEqualFunc<X> = Object.is
  ) {
    super(Set, createArrayEqual(equal))
  }

  public add (x: X): this {
    super.add(this.cloneElement(x))
    return this
  }

  protected abstract cloneElement (x: X): X
}

export = MultiKeyBase
