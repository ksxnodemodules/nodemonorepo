import * as yaml from 'js-yaml'

export function mkfn<X> (fn: (x: X) => string): (x: X) => () => void {
  return (x: X) => () => {
    expect(fn(x)).toMatchSnapshot()
  }
}

export const unsafe = mkfn(x => yaml.dump(x))
export const safe = mkfn(x => yaml.safeDump(x))
