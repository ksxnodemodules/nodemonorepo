import Base from 'advanced-set-multi-key-base'
import { IterableSetLike } from 'advanced-set-types'

/**
 * This class uses ordered arrays as keys
 */
class MutableMultiKey<
  X extends any[],
  Data extends IterableSetLike<X> = Set<X>
> extends Base<X, Data> {
  protected cloneElement (x: X): X {
    return x
  }
}

export = MutableMultiKey
