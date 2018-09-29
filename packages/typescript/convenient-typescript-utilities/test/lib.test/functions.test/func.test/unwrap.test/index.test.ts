import { func } from '../../../../../index'
const { unwrap } = func

describe('without arguments', () => {
  const lv0 = 'Returning Value'
  const lv1 = () => lv0
  const lv2 = () => lv1
  const lv3 = () => lv2

  const mkfn = <X>(x: X) =>
    () => expect(unwrap(x)).toBe(lv0)

  it('level 0', mkfn(lv0))
  it('level 1', mkfn(lv1))
  it('level 2', mkfn(lv2))
  it('level 3', mkfn(lv3))
})

describe('with arguments', () => {
  it('level 1x1', () => {
    expect(
      unwrap((...x) => [x], 'a')
    ).toEqual([['a']])
  })

  it('level 2x1', () => {
    expect(
      unwrap((...x) => (...y) => [x, y], 'a')
    ).toEqual([['a'], ['a']])
  })

  it('level 3x1', () => {
    expect(
      unwrap((...x) => (...y) => (...z) => [x, y, z], 'a')
    ).toEqual([['a'], ['a'], ['a']])
  })

  it('level 1x2', () => {
    expect(
      unwrap((...x) => [x], 'a', 'b')
    ).toEqual([['a', 'b']])
  })

  it('level 2x2', () => {
    expect(
      unwrap((...x) => (...y) => [x, y], 'a', 'b')
    ).toEqual([['a', 'b'], ['a', 'b']])
  })

  it('level 3x2', () => {
    expect(
      unwrap((...x) => (...y) => (...z) => [x, y, z], 'a', 'b')
    ).toEqual([['a', 'b'], ['a', 'b'], ['a', 'b']])
  })

  it('level 1x3', () => {
    expect(
      unwrap((...x) => [x], 'a', 'b', 'c')
    ).toEqual([['a', 'b', 'c']])
  })

  it('level 2x3', () => {
    expect(
      unwrap((...x) => (...y) => [x, y], 'a', 'b', 'c')
    ).toEqual([['a', 'b', 'c'], ['a', 'b', 'c']])
  })

  it('level 3x3', () => {
    expect(
      unwrap((...x) => (...y) => (...z) => [x, y, z], 'a', 'b', 'c')
    ).toEqual([['a', 'b', 'c'], ['a', 'b', 'c'], ['a', 'b', 'c']])
  })
})
