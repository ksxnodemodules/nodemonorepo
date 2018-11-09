import { AdjadentNumberedCalculator } from 'cached-expression-shared-utils'

class CachedFibonacci extends AdjadentNumberedCalculator<number> {
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
