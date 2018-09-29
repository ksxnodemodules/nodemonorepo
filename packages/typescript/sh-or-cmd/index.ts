import * as os from 'os'

export type Platform = NodeJS.Platform
export const platform = os.platform()

export function get<Win32 extends string, POSIX extends string> (
  options: get.Options<Win32, POSIX>
): get.Result<Win32, POSIX> {
  return platform === 'win32' ? options.win32 : options.posix
}

export namespace get {
  export interface Options<Win32 extends string, POSIX extends string> {
    readonly win32: Win32
    readonly posix: POSIX
  }

  export type Result<Win32 extends string, POSIX extends string> = Win32 | POSIX

  export namespace Default {
    export type Win32 = 'cmd'
    export type POSIX = 'sh'
    // tslint:disable-next-line:no-unnecessary-qualifier
    export type Options = get.Options<Win32, POSIX>
    export type Result = get.Result<Win32, POSIX>
    export const win32: Win32 = 'cmd'
    export const posix: POSIX = 'sh'
    export const options: Options = { win32, posix }
    export const result: Result = get(options)
  }
}

export default get.Default.result
