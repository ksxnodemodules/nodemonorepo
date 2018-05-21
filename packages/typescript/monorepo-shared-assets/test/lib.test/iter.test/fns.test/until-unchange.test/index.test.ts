import {iter} from '../../../../../index'
const {untilUnchange} = iter.fns
const init = 65536
const callback = (x: number) => x >> 1
const equal = (a: number, b: number) => a === b

it('default comparator', () => {
  expect(Array.from(untilUnchange(init, callback))).toMatchSnapshot()
})

it('custom comparator', () => {
  expect(Array.from(untilUnchange(init, callback, equal))).toMatchSnapshot()
})
