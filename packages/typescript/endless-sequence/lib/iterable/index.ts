export abstract class EndlessIterable<Element> implements Iterable<Element> {
  private readonly data: Element[]
  private readonly iterator: IterableIterator<Element>

  constructor () {
    this.data = EndlessIterable.getInitialData<Element>()
    this.iterator = this.generate()
  }

  /**
   * Get an element
   * @param index Index of element in sequence
   * @returns An element at `index`
   */
  at (index: number): Element {
    const {data} = this
    if (index < data.length) return data[index]
    this.addElements()
    return this.at(index)
  }

  /**
   * Provided by subclasses
   * @returns A never-ending iterator
   */
  protected abstract generate (): IterableIterator<Element>

  * [Symbol.iterator] () {
    yield * this.data
    yield * this.addElements()
  }

  /**
   * To be overriden by subclasses
   * @returns Initial sequence
   */
  protected static getInitialData<Element> (): Element[] {
    return []
  }

  private * addElements () {
    for (const element of this.iterator) {
      this.data.push(element)
      yield element
    }
  }

  /**
   * Inspect internal data
   * For testing and debugging purpose
   */
  get __internal () {
    const {data} = this

    return {
      /**
       * A clone of sequence
       */
      get data () {
        return Array.from(data)
      },

      /**
       * Length of sequence
       */
      get length () {
        return data.length
      }
    }
  }
}

export default EndlessIterable
