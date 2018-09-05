import splitOnce from './index'

it('matches snapshot', () => {
  const mkfn = (separator: string) => (text: string) => ({
    input: {
      text,
      separator
    },
    output: splitOnce(text, separator)
  })

  expect([
    [
      'abc,def,ghi,jkl',
      'a,bc,def,ghij',
      ',abc,def,ghi,jkl',
      'abc,def,ghi,jkl,',
      'abcdefghijkl'
    ].map(mkfn(',')),
    [
      'abc//def/ghi//jkl///mno',
      'abc//def//ghi//jkl'
    ].map(mkfn('//'))
  ]).toMatchSnapshot()
})
