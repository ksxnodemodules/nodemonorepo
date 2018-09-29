import { asyncIter } from '../../../../../index'
import getArray = asyncIter.fns.getArray

it('works', async () => {
  async function * create () {
    yield * expected
  }

  const expected = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  const received = await getArray(create())
  expect(received).toEqual(expected)
})
