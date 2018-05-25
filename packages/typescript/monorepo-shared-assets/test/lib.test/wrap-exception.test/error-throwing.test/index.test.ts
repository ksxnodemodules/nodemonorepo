import {wrapException} from '../../../../index'
import wrap = wrapException.wrapErrorThrowing

function withoutError (value: number) {
  return new Result({value})
}

function withError () {
  throw new Error('This is an error')
}

function handleError (error: any, param: number) {
  return new Result({error, param})
}

class Result {
  constructor (dict: object) {
    Object.assign(this, dict)
  }
}

describe('without error handler', () => {
  it('when no errors are thrown', () => {
    const fn = wrap(withoutError)
    expect(fn(1234)).toMatchSnapshot()
  })

  it('when an error is thrown', () => {
    const fn = wrap(withError)
    expect(() => fn(1234)).toThrowErrorMatchingSnapshot()
  })
})

describe('with error handler', () => {
  it('when no errors are thrown', () => {
    const fn = wrap(withoutError, handleError)
    expect(fn(1234)).toMatchSnapshot()
  })

  it('when an error is thrown', () => {
    const fn = wrap(withError, handleError)
    expect(fn(1234)).toMatchSnapshot()
  })
})
