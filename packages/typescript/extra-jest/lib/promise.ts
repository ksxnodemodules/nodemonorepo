export function snapRejected<X> (promise: Promise<X>) {
  return promise.then(
    value => {
      throw new Error(`Expecting promise to reject but it didn't`)
    },
    reason => {
      expect(reason).toMatchSnapshot()
    }
  )
}
