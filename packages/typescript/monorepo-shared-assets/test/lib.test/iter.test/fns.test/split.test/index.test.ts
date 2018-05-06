import {iter} from '../../../../../index'
import range = iter.fns.range
import split = iter.fns.split

it('when line exists', () => {
  expect(
    split(range(10), x => x === 5)
  ).toMatchSnapshot()
})

it('when line does not exist', () => {
  expect(
    split(range(10), () => false)
  ).toMatchSnapshot()
})
