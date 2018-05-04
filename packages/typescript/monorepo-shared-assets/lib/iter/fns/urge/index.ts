import assert from 'assert'

export type Iter<X> = IterableIterator<X>

export function * urge<X> (
  iterable: Iterable<X>,
  partLength: number,
  handleRemain: urge.RemainingHandler<X> = urge.DEFAULT_REMAINING_HANDLER
): Iter<ReadonlyArray<X>> {
  assert(partLength > 0, `${partLength} > 0`)
  assert.equal(partLength % 1, 0, `${partLength} is an integer`)
  let count = partLength
  let tray = Array<X>()

  for (const x of iterable) {
    --count
    tray.push(x)

    if (!count) {
      yield tray
      count = partLength
      tray = []
    }
  }

  yield * handleRemain(tray)
}

export namespace urge {
  export const OMIT_EMPTY_REMAINING_PART = <X>(x: ReadonlyArray<X>) => x.length ? [x] : []
  export const KEEP_REMAINING_PART = <X>(x: X) => [x]
  export const OMIT_REMAINING_PART = () => []
  export const DEFAULT_REMAINING_HANDLER = OMIT_EMPTY_REMAINING_PART
  export type RemainingHandler<X> = (tray: ReadonlyArray<X>) => ReadonlyArray<ReadonlyArray<X>>
}

export default urge
