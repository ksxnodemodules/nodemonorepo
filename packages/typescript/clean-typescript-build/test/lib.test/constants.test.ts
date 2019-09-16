import { TARGETED_EXTENSIONS } from '../../index'

it('TARGETED_EXTENSIONS matches snapshot', () => {
  expect(new Set(TARGETED_EXTENSIONS)).toMatchSnapshot()
})
