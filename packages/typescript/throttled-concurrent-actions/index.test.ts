import { range } from '@tsfun/array'
import subject from './index'

it('matches snapshot', async () => {
  const totalLength = 32
  const partLength = 5

  const actions = range(totalLength)
    .map(value => ({ value: past }: {value?: number} = {}) => ({ value, past }))
    .map((fn, i) => i & 1 ? fn : async <X>(x: X) => fn(x))

  const array = await subject(partLength, actions)
  expect(array).toMatchSnapshot()
  expect(array.map(x => x.value)).toMatchSnapshot()
  expect(array.length).toBe(totalLength)
})
