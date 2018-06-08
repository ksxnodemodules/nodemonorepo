import * as proto from 'sh-or-cmd'

const out: typeof proto = {
  default: 'sh',
  get: Object.assign(
    (_: any, posix: string) => posix,
    proto.get
  ),
  platform: 'linux'
}

export = out
