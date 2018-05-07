export type Iter<X> = IterableIterator<X>

function * map<X, Y> (
  iterable: Iterable<X>,
  fn: map.Transformer<X, Y>
): Iter<Y> {
  for (const x of iterable) {
    yield fn(x)
  }
}

export namespace map {
  export type Transformer<X, Y> = (x: X) => Y
}

export default map
