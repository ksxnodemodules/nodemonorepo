import * as subject from './index'

it('matches snapshot', () => {
  expect(subject).toMatchSnapshot()
})
