import expectFunction from '../lib/expect-function'

describe('when matched function throws an error', () => {
  const error = 'error'
  const fn = () => { throw error }

  it('matches against thrown error', () => {
    expectFunction(fn).throws.toBe(error)
  })

  it('matches thrown error against snapshot', () => {
    expectFunction(fn).throws.toMatchSnapshot()
  })

  it('throws an error for trying to get a return value', () => {
    expectFunction(() => expectFunction(fn).returns).throws.toMatchSnapshot()
  })
})

describe('when matched function does not throw an error', () => {
  const value = 'value'
  const fn = () => value

  it('matches against returning value', () => {
    expectFunction(fn).returns.toBe(value)
  })

  it('matches returning value against snapshot', () => {
    expectFunction(fn).returns.toMatchSnapshot()
  })

  it('throws an error for trying to get an error', () => {
    expectFunction(() => expectFunction(fn).throws).throws.toMatchSnapshot()
  })
})
