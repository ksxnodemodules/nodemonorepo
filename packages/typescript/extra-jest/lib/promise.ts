export function snapRejected<X> (promise: Promise<X>) {
  return promise.then(
    () => {
      throw new Error(`Expecting promise to reject but it didn't`)
    },
    reason => {
      expect(reason).toMatchSnapshot()
    }
  )
}
