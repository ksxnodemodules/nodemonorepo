export interface EndlessSequence<Element> extends Iterable<Element> {
  at (index: number): Element
  iterate (): IterableIterator<Element>
  readonly __internal: EndlessSequence.InternalInformation<Element>
}

namespace EndlessSequence {
  export interface InternalInformation<Element> {
    readonly data: Element[]
    readonly length: number
  }
}

export function create<Element> (
  generate: (previous: ReadonlyArray<Element>) => Iterable<Element>,
  initial: Iterable<Element> = []
): EndlessSequence<Element> {
  const data = Array.from(initial)

  function * addNewPart () {
    for (const element of generate(data)) {
      data.push(element)
      yield element
    }
  }

  function at (index: number): Element {
    if (index < data.length) return data[index]
    Array.from(addNewPart())
    return at(index)
  }

  function * iterate () {
    yield * data

    for ( ; ; ) {
      yield * addNewPart()
    }
  }

  return {
    at,
    iterate,
    [Symbol.iterator]: iterate,
    get __internal () {
      return {
        get data () {
          return Array.from(data)
        },

        get length () {
          return data.length
        }
      }
    }
  }
}

export default create
