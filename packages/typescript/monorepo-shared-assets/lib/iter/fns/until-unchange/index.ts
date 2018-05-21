import * as types from '../../../.types'

export type Iter<X> = IterableIterator<X>

export function * untilUnchange<X> (
  init: X,
  callback: untilUnchange.Callback<X>,
  equal: types.Func.Comparator<X> = Object.is
): Iter<X> {
  yield init
  const next = callback(init)
  if (equal(init, next)) return
  yield * untilUnchange(next, callback, equal)
}

export namespace untilUnchange {
  export type Callback<X> = (x: X) => X
}

export default untilUnchange
