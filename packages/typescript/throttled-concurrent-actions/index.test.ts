import ramda from 'ramda'
import subject from './index'

it('matches snapshot', async () => {
  const actions = ramda
    .range(0, 32)
    .map(x => x & 1 ? () => x : async () => x)

  const promise = subject(5, actions)
  expect(await promise).toMatchSnapshot()
})
