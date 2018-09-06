export =
  <Value, Element extends Value>(array: ReadonlyArray<Element>, value: Value) =>
    (array as ReadonlyArray<Value>).includes(value)
