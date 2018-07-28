import EndlessIterable from '../../iterable'

export function * fibonacci (current = 0, next = 1): IterableIterator<number> {
  yield current
  yield * fibonacci(next, current + next)
}

export class Fibonacci extends EndlessIterable<number> {
  generate () {
    return fibonacci()
  }
}

export default Fibonacci
