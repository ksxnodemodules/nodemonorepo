import {
  CalcFunc,
  MapLike
} from '../../types'

class Calculator<X, Y> {
  public readonly calculate: CalcFunc<X, Y>
  private readonly cache: MapLike<X, Y>

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

  protected createCache (): MapLike<X, Y> {
    return new Map()
  }
}

export = Calculator
