import chalk from 'chalk'
import * as assets from 'monorepo-shared-assets'
import {InvalidPackage} from '../../types'
import * as pkgUtils from '../../utils/pkg'

export function group (list: InvalidPackage.List) {
  return group.asMap(list)
}

export namespace group {
  export function asDict (list: InvalidPackage.List) {
    return assets.group.classify.dict.multiDistribute(
      list,
      item => item.reason.map(x => x.name),
      utils.DUPLICATION_CHECKER
    ).classified
  }

  export namespace asDict {
    export function simple (list: InvalidPackage.List): simple.Dict {
      const result: {
        [name: string]: simple.Dict.Value
      } = {}

      for (const [name, pkgs] of Object.entries(asDict(list))) {
        if (!pkgs) continue

        result[name] = pkgs.map(x => ({
          name: x.manifestContent.name,
          path: x.path,
          causes: Array.from(new Set(
            x.reason
              .map(asString.getReasonCauses)
              .reduce((prev, current) => [...prev, ...current])
          ))
        }))
      }

      return result
    }

    export namespace simple {
      export interface Dict {
        readonly [name: string]: Dict.Value
      }

      export namespace Dict {
        export type Value = ReadonlyArray<Value.Element>

        export namespace Value {
          export interface Element {
            readonly name?: string
            readonly path: string
            readonly causes: ReadonlyArray<string>
          }
        }
      }
    }
  }

  export function asMap (list: InvalidPackage.List) {
    return assets.group.classify.map.multiDistribute(
      list,
      item => item.reason.map(
        x => x.constructor as typeof InvalidPackage.Reason.Base
      ),
      undefined,
      utils.DUPLICATION_CHECKER
    ).classified
  }

  export function asString (list: InvalidPackage.List): string {
    return asString.fromClassifiedMap(group(list))
  }

  export namespace asString {
    export function fromClassifiedMap (map: ClassifiedMap): string {
      return Array.from(map).map(([cls, pkgs]) => {
        const {name, message} = cls.description
        const heading = indent.lv[0] + message + chalk.bold(` (${name})`)

        const content = Array.from(pkgs).map(item => {
          const heading = indent.lv[1] + pkgUtils.name(item) + chalk.dim(` (${item.path})`)

          const content = item.reason.map(
            reason => asString
              .getReasonCauses(reason)
              .filter(x => x.length)
              .map(x => indent.lv[2] + x)
              .join('\n')
          ).filter(x => x.trim().length)

          return utils.heading.concat(heading, Array.from(new Set(content)))
        })

        return utils.heading.concat(heading, content)
      }).join('\n\n')
    }

    export function getReasonCauses (reason: InvalidPackage.Reason): string[] {
      const getStringArray = () => {
        const {
          InvalidDependencies,
          NameDuplication,
          PrivateDependencies,
          SelfDependence
        } = InvalidPackage.Reason

        if (reason instanceof InvalidDependencies) {
          return reason.dependencies.map(x => x.manifestContent.name || '[anonymous]')
        }

        if (reason instanceof NameDuplication) {
          return reason.duplicates.map(x => x.path)
        }

        if (reason instanceof PrivateDependencies) {
          return reason.dependencies.map(x => x.name)
        }

        if (reason instanceof SelfDependence) {
          return []
        }

        throw new Error('Invalid type of reason')
      }

      return Array.from(new Set(getStringArray()))
    }
  }

  export type ClassifiedMap = ReadonlyMap<
    typeof InvalidPackage.Reason.Base,
    ReadonlySet<InvalidPackage.ListItem>
  >

  namespace indent {
    const character = ' '
    const prefixes = '*—→'

    export const lv = Array
      .from(assets.iter.fns.range(3))
      .map(x => character.repeat(x << 1) + prefixes[x] + ' ')
  }
}

namespace utils {
  export namespace heading {
    export function concat (
      heading: string,
      content: ReadonlyArray<string>
    ): string {
      return content.length
        ? heading + '\n' + content.join('\n')
        : heading
    }
  }

  export function DUPLICATION_CHECKER (
    a: InvalidPackage.ListItem,
    b: InvalidPackage.ListItem
  ): boolean {
    return a.path === b.path
  }
}
