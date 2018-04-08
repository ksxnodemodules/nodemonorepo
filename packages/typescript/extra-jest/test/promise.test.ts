import * as promise from '../lib/promise'

describe('promise.snapRejected', () => {
  it('fails on resolved promise', () => {
    return promise.snapRejected(
      Promise.resolve('Resolved')
    ).then(
      () => {
        throw new Error("Test was supposed to fail but it didn't")
      },
      error => {
        expect(error).toMatchSnapshot()
      }
    )
  })

  it('passes on reject promise', () => {
    promise.snapRejected(Promise.reject('Rejected'))
  })
})
