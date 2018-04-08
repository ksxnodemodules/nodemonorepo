import * as subject from './index'

it('module matches snapshot', () => {
  expect(subject).toMatchSnapshot()
})
