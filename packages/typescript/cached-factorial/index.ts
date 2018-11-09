import { AdjadentNumberedCalculator } from 'cached-expression-shared-utils'

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
