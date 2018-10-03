import { FunctionUtils } from '../../../types'

const unwrap =
  <
    Return,
    Args extends any[] = any[]
  >(fn: FunctionUtils.RecursiveReturn<Return, Args>, ...args: Args): Return =>
    typeof fn === 'function'
    // @ts-ignore
      ? unwrap<Return, Args>(fn(...args), ...args)
      : (fn)

export = unwrap
