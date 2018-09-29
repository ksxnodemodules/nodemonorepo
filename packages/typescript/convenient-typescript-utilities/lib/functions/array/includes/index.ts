import { SetUtils } from '../../../types'
const fn: SetUtils.ElementPresenceChecker =
  <Element extends Value, Value>(array: ReadonlyArray<Element>, value: Value) =>
    (array as ReadonlyArray<Value>).includes(value)
export = fn
