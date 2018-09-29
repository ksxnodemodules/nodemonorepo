import { zip } from '../../../../index'
const { FIRST, INNER_JOIN, OUTER_JOIN } = zip.object

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

describe('with KeySetProvider=INNER_JOIN', () => {
  it('with foo as first argument', () => {
    const result = zip.object(foo, bar, INNER_JOIN)
    expect(result).toMatchSnapshot()
  })

  it('with bar as first argument', () => {
    const result = zip.object(bar, foo, INNER_JOIN)
    expect(result).toMatchSnapshot()
  })
})

describe('with KeySetProvider=OUTER_JOIN', () => {
  it('with bar as first argument', () => {
    const result = zip.object(bar, foo, OUTER_JOIN)
    expect(result).toMatchSnapshot()
  })
})
