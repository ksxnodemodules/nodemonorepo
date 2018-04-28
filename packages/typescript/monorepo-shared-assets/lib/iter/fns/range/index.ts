export type Iter = IterableIterator<number>

function range (x: number) {
  const up = (() => {
    function * from (begin = 0): Iter {
      if (begin >= x) return
      yield begin
      yield * from(begin + 1)
    }

    function to (end = 0): Iter {
      return range(end).up.from(x)
    }

    return {from, to, [Symbol.iterator]: from}
  })()

  const down = (() => {
    function * from (begin = 0): Iter {
      if (begin <= x) return
      yield begin
      yield * from(begin - 1)
    }

    function to (end = 0): Iter {
      return range(end).down.from(x)
    }

    return {from, to, [Symbol.iterator]: to}
  })()

  return {up, down, [Symbol.iterator]: up.from}
}

export default range
