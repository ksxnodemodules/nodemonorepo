import partition from '../../../../lib/group/partition'

it('using list of classifiers', () => {
  type Classifier = partition.Classifier<any>

  const list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    .map(x => [x, String(x), Symbol(x), [x], {x}, Boolean(x & 1)])
    .reduce((prev, current) => [...prev, ...current])

  const classifiers: Classifier[] = [
    ['number', x => typeof x === 'number'],
    ['string', x => typeof x === 'string'],
    ['symbol', x => typeof x === 'symbol'],
    ['array', x => x instanceof Array],
    ['object', x => x && typeof x === 'object']
  ]

  const result = partition.fromClassifierList(list, classifiers)
  expect(result).toMatchSnapshot()
  expect(result).toEqual(partition(list, classifiers)) // default method
})

it('using dict of classifiers', () => {
  type Dict = partition.Classifier.Dict<any>

  const list = [
    0, 1, 2, 3,
    ...'abcd',
    4, 5, 6, 7,
    ...'ghijkl',
    8, 9
  ]

  const classifiers: Dict = {
    oddNumbers: x => isFinite(x) && Boolean(x & 1),
    evenNumbers: x => isFinite(x) && !Boolean(x & 1)
  }

  expect(partition.fromClassifierDict(list, classifiers)).toMatchSnapshot()
})
