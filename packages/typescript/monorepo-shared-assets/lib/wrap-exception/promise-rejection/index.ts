import * as types from '../../.types'
import ns = types.PromiseRejectionWrapper

export function wrapPromiseRejection<Param, Success, Failure> (
  fn: ns.Main<Param, Success>,
  handleRejection?: ns.RejectionHandler<Param, Failure>
): ns.Result<Param, Success, Failure> {
  const promisified = async (x: Param) => fn(x)

  return handleRejection
    ? (x: Param) => promisified(x).catch(reason => handleRejection(reason, x))
    : promisified
}

export default wrapPromiseRejection
