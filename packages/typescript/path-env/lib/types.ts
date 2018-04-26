export type PathDelimiter = ':' | ';'
export type PathElement = string
export type PathArray = ReadonlyArray<PathElement>
export type PathString = PathElement

export interface Env {
  readonly [name: string]: string | undefined
}

export type PathFactory = {
  get: {
    array: () => PathArray,
    string: () => PathString,
    delim: () => PathDelimiter
  },
  set: {
    array: (x: PathArray) => PathFactory,
    string: (x: PathString) => PathFactory,
    delim: (x: PathDelimiter) => PathFactory
  },
  append: (x: PathArray) => PathFactory,
  prepend: (x: PathArray) => PathFactory,
  surround: (x: PathArray) => PathFactory,
  deduplicate: () => PathFactory
}

export type EnvFactory = {
  get: {
    path: {
      name: () => string,
      factory: () => PathFactory
    },
    env: () => Env,
    rest: () => Env
  },
  set: {
    factory: (x: PathFactory) => EnvFactory,
    name: (x: string) => EnvFactory,
    delim: (x: PathDelimiter) =>EnvFactory,
  },
  path: {
    get: {
      factory: () => PathFactory,
      string: () => PathString,
      array: () => PathArray,
      delim: () => PathDelimiter,
      name: () => string
    },
    set: {
      factory: (x: PathFactory) => EnvFactory,
      string: (x: PathString) => EnvFactory,
      array: (x: PathArray) => EnvFactory,
      delim: (x: PathDelimiter) => EnvFactory,
      name: (x: string) => EnvFactory
    },
    append: (addend: PathArray) => EnvFactory,
    prepend: (addend: PathArray) => EnvFactory,
    surround: (addend: PathArray) => EnvFactory,
    deduplicate: () => EnvFactory
  }
}
