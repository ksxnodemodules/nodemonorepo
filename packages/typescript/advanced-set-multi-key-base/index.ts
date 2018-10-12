import { zip } from 'iter-tools'
import AlteredEqual from 'advanced-set-altered-equal'

import {
  IterableSetLike,
  SetLikeConstructor,
  ElementEqualFunc,
  UnboundedArray
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
    type ElementSet = UnboundedArray<X>

    const equalElementSet = (left: ElementSet, right: ElementSet): boolean => {
      if (left.length !== right.length) return false

      for (const [a, b] of zip(left, right)) {
        if (!equal(a, b)) return false
      }

      return true
    }

    super(Set, equalElementSet)
  }

  public add (x: X): void {
    super.add(this.cloneElement(x))
  }

  protected abstract cloneElement (x: X): X
}

export = MultiKeyBase
