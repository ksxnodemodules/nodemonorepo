import assert from 'static-type-assert'
import create from '../index'

{
  const fn = create<number[]>(x => {
    assert<number>(x)
    return false
  })

  assert<(a: number[], b: number[]) => boolean>(fn)
  fn([0, 1, 2], [3])
}

{
  const fn = create<ReadonlyArray<'a' | 'b'>>(x => {
    assert<'a' | 'b'>(x)
    return false
  })

  assert<(a: ReadonlyArray<'a' | 'b'>, b: ReadonlyArray<'a' | 'b'>) => boolean>(fn)
  fn(['a'], ['b'])
}

{
  const fn = create<[0, 1, 2] | ['a', 'b']>(x => {
    assert<0 | 1 | 2 | 'a' | 'b'>(x)
    return false
  })

  assert<(a: [0, 1, 2] | ['a', 'b'], b: [0, 1, 2] | ['a', 'b']) => boolean>(fn)
  fn([0, 1, 2], ['a', 'b'])
}
