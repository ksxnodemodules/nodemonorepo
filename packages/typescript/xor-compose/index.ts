export type Fn<X> = (x: X) => number

export const compose =
  <X>(a: Fn<X>, b?: Fn<X>, ...rest: Fn<X>[]): Fn<X> =>
    b ? compose((x: any) => a(x) ^ b(x), ...rest) : a

export default compose
