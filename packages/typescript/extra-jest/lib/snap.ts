import * as yaml from 'js-yaml'

export type DumpOptions = yaml.DumpOptions
export type DumpFunction<X> = (x: X, o?: DumpOptions) => string
export type TestFunction<X> = (x: X, o?: DumpOptions) => () => void

export function mkfn<X> (fn: DumpFunction<X>, options: DumpOptions = {}): TestFunction<X> {
  return (x: X, extraOptions: DumpOptions = {}) => () => {
    expect('\n' + fn(x, { ...options, ...extraOptions }) + '\n').toMatchSnapshot()
  }
}

const defaultOptions: DumpOptions = {
  skipInvalid: true,
  sortKeys: true,
  noRefs: false,
  noCompatMode: true
}

const unsafeDump: DumpFunction<any> = (x, o) => yaml.dump(x, o)
const safeDump: DumpFunction<any> = (x, o) => yaml.safeDump(x, o)

export const unsafe = mkfn(unsafeDump, defaultOptions)
export const safe = mkfn(safeDump, defaultOptions)
export const pureUnsafe = mkfn(unsafeDump)
export const pureSafe = mkfn(safeDump)
export const noRefs = mkfn(unsafeDump, { noRefs: true })

export default unsafe
