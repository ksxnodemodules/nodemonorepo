import {splitAt, range} from 'ramda'

export type Action<X> = (x?: X) => X | Promise<X>

const INITIAL_PROMISE = Promise.resolve()

export function throttledConcurrentActions<X> (
  count: number,
  list: ReadonlyArray<Action<X>>,
  past: ReadonlyArray<Promise<X | undefined>> = []
): Promise<ReadonlyArray<X>> {
  const indexes = range(0, count)
  return Promise.all(main(list, past))

  function main (
    list: ReadonlyArray<Action<X>>,
    past: ReadonlyArray<Promise<X | undefined>>
  ): ReadonlyArray<Promise<X>> {
    const [current, next] = splitAt(count, list)

    const nextPast = indexes.map(
      index =>
        (past[index] || INITIAL_PROMISE)
          .then(current[index] || (x => x))
    )

    return next.length
      ? main(next, nextPast)
      : nextPast
  }
}

export default throttledConcurrentActions
