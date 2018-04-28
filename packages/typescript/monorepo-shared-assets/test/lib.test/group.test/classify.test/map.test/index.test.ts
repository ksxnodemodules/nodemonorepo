import classify from '../../../../../lib/group/classify/map'

const getList = () => range(0, 16)
const factors = Array.from(range(2, 16))

describe('single distribution', () => {
  it('in basic use', () => {
    const classifier = (x: number) => `Ring(4, ${x % 4})`
    expect(classify.singleDistribute(getList(), classifier)).toMatchSnapshot()
  })

  it('in advanced use', () => {
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
})

describe('multiple distribution', () => {
  it('in basic use', () => {
    const classifier = (x: number) => factors
      .filter(y => ![0, 1, x].includes(y) && !(x % y))
      .map(y => `x${y}`)

    expect(classify.multiDistribute(getList(), classifier)).toMatchSnapshot()
  })

  it('in advanced use', () => {
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
})

function * range (begin: number, end: number): IterableIterator<number> {
  if (begin === end) return
  yield begin
  yield * range(begin + 1, end)
}
