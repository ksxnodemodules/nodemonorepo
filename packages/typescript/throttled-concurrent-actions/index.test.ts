import ramda from 'ramda'
import subject from './index'

it('matches snapshot', async () => {
  const actions = ramda
    .range(0, 32)
    .map(value => ({value: past}: {value?: number} = {}) => ({value, past}))
    .map((fn, i) => i & 1 ? fn : async <X>(x: X) => fn(x))

  const promise = subject(5, actions)
  expect(await promise).toMatchSnapshot()
})
