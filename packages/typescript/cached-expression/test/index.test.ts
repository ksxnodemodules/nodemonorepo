import { product } from 'iter-tools'
import Calculator from '../index'

const keys = [0, 1, false, true, {}, { hello: 'world' }, [], ['foo', 'bar']]

it('calls every function once', () => {
  const count = Array<any>()
  const fn = (x: any) => {
    count.push(x)
    return { x }
  }
  const { calculate } = new Calculator(fn)

  for (const x of keys) {
    Array(5).fill(0).forEach(() => calculate(x))
  }

  expect(count.length).toBe(keys.length)
})

it('calls functions again after resetting caches', () => {
  let index = 0
  let count = 0
  const record = Array<any>()
  const fn = (value: any) => {
    record.push({ index, count, value })
    const result = { index, count, value }
    ++count
    return result
  }
  const calculator = new Calculator(fn)
  const value = 'value'
  const calc = () => {
    const result = calculator.calculate(value)
    ++index
    return result
  }

  const x0 = calc()
  const x1 = calc()
  calculator.resetCache()
  const x2 = calc()
  const x3 = calc()

  expect(record).toEqual([
    { index: 0, count: 0, value },
    { index: 2, count: 1, value }
  ])

  expect({ x0, x1, x2, x3 }).toEqual({
    x0: { index: 0, count: 0, value },
    x1: { index: 0, count: 0, value },
    x2: { index: 2, count: 1, value },
    x3: { index: 2, count: 1, value }
  })

  expect(x0).not.toBe(x2)
  expect(x0).toBe(x1)
  expect(x2).toBe(x3)
})

it('caches results', () => {
  const { calculate } = new Calculator(Math.random)
  const getArray = () => keys.map(calculate)
  const first = getArray()
  const second = getArray()
  const third = getArray()
  const fourth = getArray()
  expect(first).toEqual(second)
  expect(first).toEqual(third)
  expect(first).toEqual(fourth)
})

it('produces same references for same inputs', () => {
  const fn = (x: any) => ({ x })
  const { calculate } = new Calculator(fn)
  const input = 'input'
  const expected = calculate(input)
  const received = calculate(input)
  expect(received).toBe(expected)
})

it('produces different references for different inputs', () => {
  const fn = (x: any) => ({ x })
  const { calculate } = new Calculator(fn)

  for (const [left, right] of product(keys, keys)) {
    if (left === right) continue
    expect(calculate(left)).not.toBe(calculate(right))
  }
})

it('produces correct results', () => {
  const fn = (x: any) => ({ x })
  const { calculate } = new Calculator(fn)
  const expected = keys.map(fn)
  const received = keys.map(calculate)
  expect(received).toEqual(expected)
})
