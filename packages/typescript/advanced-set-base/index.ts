import {
  SetLikeConstructor,
  SetLike
} from 'advanced-set-types'

/**
 * Abstract base class for every Set-like class within `advanced-set` package
 */
abstract class Base<
  X,
  Data extends SetLike<X> = Set<X>
> implements SetLike<X> {
  protected readonly data: Data
  public abstract has (x: X): boolean
  public abstract add (x: X): this
  public abstract delete (x: X): boolean

  /**
   * @param Set A constructor (a.k.a class) that creates a Set-like instance
   */
  constructor (Set: SetLikeConstructor<Data>) {
    this.data = new Set()
  }
}

export = Base
