import {iter} from '../../../../../index'
import range = iter.fns.range
import split = iter.fns.split

it('matches snapshot', () => {
  expect(
    split(range(10), x => x === 5)
  ).toMatchSnapshot()
})
