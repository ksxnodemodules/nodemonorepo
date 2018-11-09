import { Calculator } from 'cached-expression'

/**
 * Utilize [cached-expression](https://www.npmjs.com/package/cached-expression)
 * to calculate fibonacci numbers
 *
 * **Definition:**
 * * fib(0) = 0
 * * fib(1) = 1
 * * ∀ n ≥ 2: fib(n) = fib(n - 2) + fib(n - 1)
 *
 * @example
 * import CachedFibonacci from 'cached-fibonacci'
 * const { calculate } = new CachedFibonacci()
 * const result = [0, 1, 2, 3, 4, 5].map(calculate) // expect: [0, 1, 1, 2, 3, 5]
 */
class CachedFibonacci extends Calculator<number, number> {
  constructor () {
    super(x => {
      if (x === 0) return 0
      if (x === 1) return 1
      return calculate(x - 2) + calculate(x - 1)
    })

    const { calculate } = this
  }
}

export = CachedFibonacci
