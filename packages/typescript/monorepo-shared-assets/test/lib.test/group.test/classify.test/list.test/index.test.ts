import classify from '../../../../../lib/group/classify/list'


describe('single distribution', () => {
  const list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

  it('in basic use', () => {
    const classifier = (x: number) => `Ring(4, ${x % 4})`
    expect(classify.singleDistribute(list, classifier)).toMatchSnapshot()
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

    const classifier = (shift: number) => new RingOf4(shift)
    const identifier = (a: RingOf4, b: RingOf4) => a.equal(b)

    expect(classify.singleDistribute(list, classifier, identifier)).toMatchSnapshot()
  })
})

describe('multiple distribution', () => {
  const list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
  const dividers = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

  it('in basic use', () => {
    const classifier = (x: number) => dividers
      .filter(y => ![0, 1, x].includes(y) && !(x % y))
      .map(y => `x${y}`)

    expect(classify.multiDistribute(list, classifier)).toMatchSnapshot()
  })
})
