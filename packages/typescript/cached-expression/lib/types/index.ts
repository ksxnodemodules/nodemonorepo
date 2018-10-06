export type CalcFunc<X, Y> = (x: X) => Y

export interface MapLike<X, Y> {
  has (x: X): boolean
  get (x: X): Y | undefined
  set (x: X, y: Y): void
}
