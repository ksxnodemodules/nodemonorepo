import * as subject from '../index'

describe('main module', () => {
  it('matches snapshot', () => expect(subject).toMatchSnapshot())
})
