import * as assets from 'monorepo-shared-assets'
import subject from './index'

it('matches snapshot', async () => {
  const actions = Array
    .from(assets.iter.fns.range(32))
    .map(x => async () => x)

  const array = await subject.asArray(actions, 5)
  expect(array).toMatchSnapshot()
})
