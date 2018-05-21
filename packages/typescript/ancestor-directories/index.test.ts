import subject from './index'

it('matches snapshot', () => {
  expect(
    [
      'abc/def/ghi',
      './abc/def/ghi',
      '/abc/def/ghi',
      'abc',
      '.',
      ''
    ].map(
      x => ({
        input: x,
        output: Array.from(subject(x))
      })
    )
  ).toMatchSnapshot()
})
