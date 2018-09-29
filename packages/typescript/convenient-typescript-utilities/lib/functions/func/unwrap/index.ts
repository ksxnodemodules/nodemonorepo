import { FunctionUtils } from '../../../types'

const unwrap =
  <
    Return,
    Args extends any[] = any[]
  >(fn: FunctionUtils.RecursiveReturn<Return, Args>, ...args: Args): Return =>
    // tslint:disable-next-line:comment-format
    //@ts-ignore
    typeof fn === 'function'
      ? unwrap<Return, Args>(fn(...args), ...args)
      : (fn)

export = unwrap
