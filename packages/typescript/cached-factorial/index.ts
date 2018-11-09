import { AdjadentNumberedCalculator } from 'cached-expression-shared-utils'

/**
 * Utilize [cached-expression](https://www.npmjs.com/package/cached-expression)
 * to calculate multiple factorial numbers
 *
 * **Definition:**
 * * 0! = 1! = 1
 * * ∀ n ≥ 2: n! = n * (n - 1)!
 *
 * @example
 * import CachedFactorial from 'cached-factorial'
 * const { calculate } = new CachedFactorial()
 * const result = [0, 1, 2, 3, 4, 5].map(calculate) // expect: [1, 1, 2, 6, 24, 120]
 */
class CachedFactorial extends AdjadentNumberedCalculator<number> {
  constructor () {
    super(
      x => x < 2
        ? 1
        : x * calculate(x - 1)
    )

    const { calculate } = this
  }
}

export = CachedFactorial
