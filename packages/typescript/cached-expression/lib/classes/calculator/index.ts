import {
  CalcFunc,
  MapLike
} from '../../types'

/**
 * Calculates once for every value
 *
 * @example
 * import assert from 'assert'
 * import { Calculator } from 'cached-expression'
 * const { calculate } = new Calculator(x => [x, Math.random()])
 *
 * const a0 = calculate('a')
 * const a1 = calculate('a')
 * const a2 = calculate('a')
 * const b0 = calculate('b')
 *
 * assert(a0 === a1)
 * assert(a0 === a2)
 * assert(a0 !== b0)
 */
class Calculator<X, Y> {
  public readonly calculate: CalcFunc<X, Y>
  private readonly cache: MapLike<X, Y>

  /**
   * @param calc Function that executes once and return a value corresponding to given input
   */
  constructor (calc: CalcFunc<X, Y>) {
    this.cache = this.createCache()
    this.calculate = this.createCalcFunc(calc)
  }

  protected createCalcFunc (calc: CalcFunc<X, Y>): CalcFunc<X, Y> {
    const { cache } = this

    return x => {
      if (cache.has(x)) return cache.get(x) as Y
      const y = calc(x)
      cache.set(x, y)
      return y
    }
  }

  /**
   * Override this function to choose a different Map-like object
   */
  protected createCache (): MapLike<X, Y> {
    return new Map()
  }
}

export = Calculator
