import map from '../map'

export type Iter<X> = IterableIterator<X>

export function split<X> (
  iterable: Iterable<X>,
  choose: split.func.LineChooser<X>
): Iter<split.func.Segment<X>> {
  return split.func(iterable, choose)
}

export namespace split {
  export function * func<X> (
    iterable: Iterable<X>,
    choose: func.LineChooser<X>
  ): Iter<func.Segment<X>> {
    let list = Array<X>()

    for (const item of iterable) {
      if (choose(item)) {
        yield { list, line: item, last: false }
        list = []
      } else {
        list.push(item)
      }
    }

    yield { list, line: undefined, last: true }
  }

  export namespace func {
    export type Segment<X> = Segment.NotLast<X> | Segment.Last<X>

    export namespace Segment {
      export interface Base<X> {
        readonly list: ReadonlyArray<X>
        readonly line: X | void
        readonly last: boolean
      }

      export interface NotLast<X> extends Base<X> {
        readonly line: X
        readonly last: false
      }

      export interface Last<X> extends Base<X> {
        readonly line: void
        readonly last: true
      }
    }

    export type LineChooser<X> = (x: X) => boolean
  }

  export function line<X> (
    iterable: Iterable<X>,
    line: X,
    compare: line.Comparator<X> = line.DEFAULT_COMPARATOR
  ): Iter<ReadonlyArray<X>> {
    return map(
      func(iterable, x => compare(line, x)),
      x => x.list
    )
  }

  export namespace line {
    export type Comparator<X> = (a: X, b: X) => boolean
    export const DEFAULT_COMPARATOR = Object.is
  }
}

export default split
