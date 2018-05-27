import * as types from '../../.types'
import ns = types.ErrorThrowingWrapper

export function wrapErrorThrowing<Param, Success, Failure> (
  fn: ns.Main<Param, Success>,
  handleError?: ns.ErrorHandler<Param, Failure>
): ns.Result<Param, Success, Failure> {
  return handleError
    ? (x: Param) => {
      try {
        return fn(x)
      } catch (error) {
        return handleError(error, x)
      }
    }
    : fn
}

export default wrapErrorThrowing
