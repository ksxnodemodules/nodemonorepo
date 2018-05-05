export type Iter<X> = IterableIterator<X>

export function * repeat<X> (iter: Iterable<X>, times: number): Iter<X> {
  if (times <= 0) return
  yield * iter
  yield * repeat(iter, times - 1)
}

export namespace repeat {
  export const element = <X>(x: X, times: number) => repeat([x], times)
}

export default repeat
