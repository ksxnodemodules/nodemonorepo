import { MapLike, Calculator } from 'cached-expression'

/**
 * @private
 * This class is for `AdjadentNumberedCalculator` only
 */
class AdjadentNumberedMap<Value> extends Map<number, Value> implements MapLike<number, Value> {
  private maxKey = 0

  public has (key: number): boolean {
    return key <= this.maxKey
  }

  public set (key: number, value: Value): this {
    if (this.maxKey < key) {
      this.maxKey = key
    }

    super.set(key, value)

    return this
  }
}

/**
 * This class is useful when `calculate(n)` requires `calculate(n - 1)` (e.g. factorial)
 */
export abstract class AdjadentNumberedCalculator<Value> extends Calculator<number, Value> {
  protected createCache (): MapLike<number, Value> {
    return new AdjadentNumberedMap<Value>()
  }
}
