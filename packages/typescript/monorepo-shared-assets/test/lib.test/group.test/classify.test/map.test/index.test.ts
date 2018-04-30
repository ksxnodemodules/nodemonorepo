import {iter, group} from '../../../../../index'
const classify = group.classify.map
const getList = () => iter.fns.range(16)
const factors = Array.from(iter.fns.range(2).up.to(16))

class ValueCarrier {
  readonly value: number

  constructor (value: number) {
    this.value = value
  }

  equal (cmp: ValueCarrier) {
    return this.value === cmp.value
  }
}

describe('single distribution', () => {
  it('in basic use', () => {
    const classifier = (x: number) => `Ring(4, ${x % 4})`
    expect(classify.singleDistribute(getList(), classifier)).toMatchSnapshot()
  })

  it('with specified identifier', () => {
    class RingOf4 {
      readonly shift: number

      constructor (shift: number) {
        this.shift = shift
      }

      equal (cmp: RingOf4) {
        return this.shift === cmp.shift
      }
    }

    const classifier = (x: number) => new RingOf4(x % 4)
    const identifier = (a: RingOf4, b: RingOf4) => a.equal(b)

    expect(classify.singleDistribute(getList(), classifier, identifier)).toMatchSnapshot()
  })

  it('with specified duplicationChecker', () => {
    const list = Array
      .from(iter.fns.repeat(getList(), 3))
      .map(value => new ValueCarrier(value))

    const classifier = (x: ValueCarrier) => `Ring(4, ${x.value % 4})`
    const duplicationChecker = (a: ValueCarrier, b: ValueCarrier) => a.equal(b)

    expect(classify.singleDistribute(list, classifier, undefined, duplicationChecker)).toMatchSnapshot()
  })
})

describe('multiple distribution', () => {
  it('in basic use', () => {
    const classifier = (x: number) => factors
      .filter(y => ![0, 1, x].includes(y) && !(x % y))
      .map(y => `x${y}`)

    expect(classify.multiDistribute(getList(), classifier)).toMatchSnapshot()
  })

  it('with specified identifier', () => {
    class Multiple {
      readonly factor: number

      constructor (factor: number) {
        this.factor = factor
      }

      equal (cmp: Multiple) {
        return this.factor === cmp.factor
      }
    }

    const classifier = (x: number) => factors
      .filter(factor => ![0, 1, x].includes(factor) && !(x % factor))
      .map(factor => new Multiple(factor))

    const identifier = (a: Multiple, b: Multiple) => a.equal(b)

    expect(classify.multiDistribute(getList(), classifier, identifier)).toMatchSnapshot()
  })

  it('with specified duplicationChecker', () => {
    const list = Array
      .from(iter.fns.repeat(getList(), 3))
      .map(value => new ValueCarrier(value))

    const classifier = (x: ValueCarrier) => factors
      .filter(y => ![0, 1, x.value].includes(y) && !(x.value % y))
      .map(y => `x${y}`)

    const duplicationChecker = (a: ValueCarrier, b: ValueCarrier) => a.equal(b)

    expect(classify.multiDistribute(list, classifier, undefined, duplicationChecker)).toMatchSnapshot()
  })
})
