export type Platform = NodeJS.Platform

export declare const platform: Platform

export declare function get<Win32 extends string, POSIX extends string>(
  options?: get.Options<Win32, POSIX>
): get.Result<Win32, POSIX>

export declare namespace get {
  interface Options<Win32 extends string, POSIX extends string> {
    readonly win32?: Win32
    readonly posix?: POSIX
  }

  type Result<Win32 extends string, POSIX extends string> = Win32 | POSIX
}

declare const _default: get.Result<'cmd', 'sh'>
export default _default
