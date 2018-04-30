import chalk from 'chalk'
import * as assets from 'monorepo-shared-assets'
import {InvalidPackage} from '../../types'
import * as pkgUtils from '../../utils/pkg'

export function group (list: InvalidPackage.List) {
  return assets.group.classify.map.multiDistribute(
    list,
    item => item.reason.map(
      x => x.constructor as typeof InvalidPackage.Reason.Base
    )
  ).classified
}

export namespace group {
  namespace indent {
    const character = ' '
    const prefixes = '*—→'

    export const lv = Array
      .from(assets.iter.fns.range(3))
      .map(x => character.repeat(x << 1) + prefixes[x] + ' ')
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
}
