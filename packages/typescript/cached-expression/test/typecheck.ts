import assert from 'static-type-assert'
import Calculator from '../index'

declare function nonOverloadedFunc (x: number): string
assert<typeof nonOverloadedFunc>(new Calculator(nonOverloadedFunc).calculate)

declare function overloadedFunc (x: 0): 'zero'
declare function overloadedFunc (x: 1): 'one'
declare function overloadedFunc (x: 2): 'two'
assert<typeof overloadedFunc>(new Calculator(overloadedFunc).calculate)
