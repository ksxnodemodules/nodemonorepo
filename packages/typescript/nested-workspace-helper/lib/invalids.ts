import getDependencyMap from './dep-map'

import {
  PackageListItem,
  DependencyMap,
  InvalidPackage
} from './types'

export async function listAllInvalidPackages (dirname: string): Promise<InvalidPackage.List> {
  return listAllInvalidPackages.fromDependencyMap(await getDependencyMap(dirname))
}

export namespace listAllInvalidPackages {
  export function fromDependencyMap (map: DependencyMap): InvalidPackage.List {
    const prvs = fromDependencyMap.getPrivateDependencyVictims(map)
    const ivls = fromDependencyMap.getInvalidDependencyVictims(map, prvs)

    const db: {
      [name: string]: InvalidPackage.ListItem
    } = {}

    for (const victim of [...prvs, ...ivls]) {
      const {name = ''} = (victim as PackageListItem).manifestContent

      if (name in db) {
        const temp = db[name]

        const reason = [
          ...temp.reason,
          ...victim.reason
        ]

        db[name] = {
          ...victim,
          reason
        }
      } else {
        db[name] = {...victim}
      }
    }

    return Object.values(db)
  }

  export namespace fromDependencyMap {
    export function getInvalidDependencyVictims (
      map: DependencyMap,
      invalids: InvalidPackage.List
    ): ReadonlyArray<getInvalidDependencyVictims.Victim> {
      const newInvalids: getInvalidDependencyVictims.Victim[] = []

      for (const {list, dependant} of Object.values(map)) {
        const filtered = invalids.filter(
          x => list.some(y => x.manifestContent.name === y.name)
        )

        if (filtered.length) {
          const reason = [new InvalidPackage.Reason.InvalidDependencies(filtered)]
          newInvalids.push({...dependant, reason})
        }
      }

      return invalids.length === newInvalids.length
        ? newInvalids
        : getInvalidDependencyVictims(map, newInvalids)
    }

    export namespace getInvalidDependencyVictims {
      export interface Victim extends InvalidPackage.ListItem {}
    }

    export function getPrivateDependencyVictims (
      map: DependencyMap
    ): ReadonlyArray<getPrivateDependencyVictims.Victim> {
      const result: getPrivateDependencyVictims.Victim[] = []

      for (const {list, dependant} of Object.values(map)) {
        if (dependant.manifestContent.private) continue

        const filtered = list
          .filter(x => x.type !== 'dev')
          .filter(x => x.info.manifestContent.private)

        if (filtered.length) {
          const reason = [new InvalidPackage.Reason.PrivateDependencies(filtered)]
          result.push({...dependant, reason})
        }
      }

      return result
    }

    export namespace getPrivateDependencyVictims {
      export interface Victim extends InvalidPackage.ListItem<
        InvalidPackage.Reason.PrivateDependencies
      > {}
    }
  }
}

export default listAllInvalidPackages
