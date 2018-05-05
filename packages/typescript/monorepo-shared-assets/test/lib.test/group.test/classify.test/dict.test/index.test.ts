import {iter, group} from '../../../../../index'
const classify = group.classify.dict
const getList = () => iter.fns.range(16)
const dividers = Array.from(iter.fns.range(2).up.to(16))

class ValueCarrier {
  readonly value: number

  constructor (value: number) {
    this.value = value
  }

  equal (cmp: ValueCarrier) {
    return this.value === cmp.value
  }
}

const repeatedList = Array
  .from(iter.fns.repeat(getList(), 3))
  .map(x => new ValueCarrier(x))

const duplicationChecker = (a: ValueCarrier, b: ValueCarrier) => a.equal(b)

describe('single distribution', () => {
  it('in basic use', () => {
    const classifier = (x: number) => `Ring(4, ${x % 4})`
    expect(classify.singleDistribute(getList(), classifier)).toMatchSnapshot()
  })

  it('with specified duplicationChecker', () => {
    const classifier = (x: ValueCarrier) => `Ring(4, ${x.value % 4})`
    expect(classify.singleDistribute(repeatedList, classifier, duplicationChecker)).toMatchSnapshot()
  })
})

describe('multiple distribution', () => {
  it('in basic use', () => {
    const classifier = (x: number) => dividers
      .filter(y => ![0, 1, x].includes(y) && !(x % y))
      .map(y => `x${y}`)

    expect(classify.multiDistribute(getList(), classifier)).toMatchSnapshot()
  })

  it('with specified duplicationChecker', () => {
    const classifier = (x: ValueCarrier) => dividers
      .filter(y => ![0, 1, x.value].includes(y) && !(x.value % y))
      .map(y => `x${y}`)

    expect(classify.multiDistribute(repeatedList, classifier, duplicationChecker)).toMatchSnapshot()
  })
})
