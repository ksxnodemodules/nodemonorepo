import {zip} from '../../../../index'
const {FIRST, INNER_JOIN, OUTER_JOIN} = zip.object

const foo = {
  sharedA: 'fooA',
  sharedB: 'fooB',
  ownFooC: 'fooC',
  ownFooD: 'fooD'
}

const bar = {
  sharedA: 'barA',
  sharedB: 'barB',
  ownBarC: 'barC',
  ownBarD: 'barD'
}

describe('with KeySetProvider=FIRST', () => {
  it('with foo as first argument', () => {
    const result = zip.object(foo, bar, FIRST)
    expect(result).toMatchSnapshot()
    expect(result).toEqual(zip.object(foo, bar)) // default parameter
  })

  it('with bar as first argument', () => {
    const result = zip.object(bar, foo, FIRST)
    expect(result).toMatchSnapshot()
    expect(result).toEqual(zip.object(bar, foo)) // default parameter
  })
})

it('with KeySetProvider=INNER_JOIN', () => {
  const result = zip.object(foo, bar, INNER_JOIN)
  expect(result).toMatchSnapshot()
  expect(result).toEqual(zip.object(bar, foo, INNER_JOIN))
})

it('with KeySetProvider=OUTER_JOIN', () => {
  const result = zip.object(foo, bar, OUTER_JOIN)
  expect(result).toMatchSnapshot()
  expect(result).toEqual(zip.object(bar, foo, OUTER_JOIN))
})
