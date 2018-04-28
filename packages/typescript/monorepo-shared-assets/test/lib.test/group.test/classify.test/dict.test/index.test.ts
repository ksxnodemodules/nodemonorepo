import {iter, group} from '../../../../../index'
const classify = group.classify.dict
const getList = () => iter.fns.range(16)
const dividers = Array.from(iter.fns.range(2).up.to(16))

it('single distribution', () => {
  const classifier = (x: number) => `Ring(4, ${x % 4})`
  expect(classify.singleDistribute(getList(), classifier)).toMatchSnapshot()
})

it('multiple distribution', () => {
  const classifier = (x: number) => dividers
    .filter(y => ![0, 1, x].includes(y) && !(x % y))
    .map(y => `x${y}`)

  expect(classify.multiDistribute(getList(), classifier)).toMatchSnapshot()
})
