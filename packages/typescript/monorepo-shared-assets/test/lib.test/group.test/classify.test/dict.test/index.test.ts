import classify from '../../../../../lib/group/classify/dict'

it('single distribution', () => {
  const list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
  const classifier = (x: number) => `Ring(4, ${x % 4})`
  expect(classify.singleDistribute(list, classifier)).toMatchSnapshot()
})

it('multiple distribution', () => {
  const list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
  const dividers = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

  const classifier = (x: number) => dividers
    .filter(y => ![0, 1, x].includes(y) && !(x % y))
    .map(y => `x${y}`)

  expect(classify.multiDistribute(list, classifier)).toMatchSnapshot()
})
