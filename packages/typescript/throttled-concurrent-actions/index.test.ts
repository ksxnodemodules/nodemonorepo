import ramda from 'ramda'
import subject from './index'

it('matches snapshot', async () => {
  const actions = ramda
    .range(0, 32)
    .map(value => ({value: past}: {value?: number} = {}) => ({value, past}))
    .map((fn, i) => i & 1 ? fn : async <X>(x: X) => fn(x))

  const array = await subject(5, actions)
  expect(array).toMatchSnapshot()
  expect(array.map(x => x.value)).toMatchSnapshot()
  expect(array.length).toBe(32)
})
