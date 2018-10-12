import { ElementOf } from 'typescript-miscellaneous'

export interface SetLike<X> {
  has (x: X): boolean
  add (x: X): void
  delete (x: X): boolean
}

export type IterableSetLike<X> = SetLike<X> & Iterable<X>

export interface SetLikeConstructor<Instance extends SetLike<any>> {
  new (): Instance
}

export type SetLikeElement<Instance extends SetLike<any>> =
  Instance extends SetLike<infer X> ? X : never

export type EqualFunc<X> = (a: X, b: X) => boolean
export type ElementEqualFunc<X extends any[]> = EqualFunc<ElementOf<X>>
export type UnboundedArray<X extends any[]> = ElementOf<X>[]
