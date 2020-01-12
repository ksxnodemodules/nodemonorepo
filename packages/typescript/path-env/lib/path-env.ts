import * as path from 'path'

import {
  PathArray,
  PathString,
  PathDelimiter,
  PathFactory,
  Env,
  EnvFactory
} from './types'

export const delimiter = () => path.delimiter as PathDelimiter
export const split = (str: PathString, delim = delimiter()): PathArray => str.split(delim)
export const join = (array: PathArray, delim = delimiter()): PathString => array.join(delim)

export function pathString (str: PathString, delim?: PathDelimiter) {
  return pathArray(split(str, delim), delim)
}

export function pathArray (array: PathArray, delim = delimiter()): PathFactory {
  const append = (addend: PathArray) =>
    pathArray(array.concat(...addend), delim)

  const prepend = (addend: PathArray) =>
    pathArray(addend.concat(...array), delim)

  const surround = (addend: PathArray) =>
    pathArray(addend.concat(...array).concat(...addend), delim)

  const deduplicate = () =>
    pathArray(Array.from(new Set(array)), delim)

  return {
    get: {
      array: () => array,
      string: () => join(array, delim),
      delim: () => delim
    },
    set: {
      array: (x: PathArray) => pathArray(x, delim),
      string: (x: PathString) => pathString(x, delim),
      delim: (x: PathDelimiter) => pathArray(array, x)
    },
    append,
    prepend,
    surround,
    deduplicate
  }
}

export function pathEnv (env: Env, name = 'PATH', delim = delimiter()): EnvFactory {
  const { [name]: str = '', ...restEnv } = env
  const factory = pathString(str, delim)

  function main (
    factory: PathFactory,
    name: string,
    delim: PathDelimiter
  ): EnvFactory {
    const replaceFactory = (x: PathFactory) => main(x, name, x.get.delim())

    return {
      get: {
        path: {
          name: () => name,
          factory: () => factory
        },
        env: () => ({
          [name]: factory.get.string(),
          ...restEnv
        }),
        rest: () => restEnv
      },
      set: {
        factory: replaceFactory,
        name: (x: string) => main(factory, x, delim),
        delim: (x: PathDelimiter) => main(factory, name, x)
      },
      path: {
        get: {
          ...factory.get,
          factory: () => factory,
          name: () => name
        },
        set: {
          factory: replaceFactory,
          string: (x: PathString) => main(factory.set.string(x), name, delim),
          array: (x: PathArray) => main(factory.set.array(x), name, delim),
          delim: (x: PathDelimiter) => main(factory.set.delim(x), name, x),
          name: (x: string) => main(factory, x, delim)
        },
        append: (addend: PathArray) =>
          replaceFactory(factory.append(addend)),
        prepend: (addend: PathArray) =>
          replaceFactory(factory.prepend(addend)),
        surround: (addend: PathArray) =>
          replaceFactory(factory.surround(addend)),
        deduplicate: () =>
          replaceFactory(factory.deduplicate())
      }
    }
  }

  return main(factory, name, delim)
}
