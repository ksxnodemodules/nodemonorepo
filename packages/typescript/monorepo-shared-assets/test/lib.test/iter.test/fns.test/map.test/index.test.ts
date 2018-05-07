import {iter} from '../../../../../index'
const {range, map} = iter.fns

it('matches snapshot', () => {
  class ValueCarrier {
    readonly value: number

    constructor (value: number) {
      this.value = value
    }
  }

  expect(
    Array.from(
      map(range(16), x => new ValueCarrier(x))
    )
  ).toMatchSnapshot()
})
