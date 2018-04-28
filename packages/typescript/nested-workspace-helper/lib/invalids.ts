import getDependencyMap from './dep-map'

import {
  Package,
  Dependency,
  InvalidPackage
} from './types'

export async function listAllInvalidPackages (dirname: string): Promise<InvalidPackage.List> {
  return listAllInvalidPackages.fromDependencyMap(await getDependencyMap(dirname))
}

export namespace listAllInvalidPackages {
  export function fromDependencyMap (map: Dependency.Map): InvalidPackage.List {
    const prvs = fromDependencyMap.getPrivateDependencyVictims(map)
    const dups = fromDependencyMap.getNameDuplicationVictims(map)
    const sfds = fromDependencyMap.getSelfDependenceVictims(map)
    const ivls = fromDependencyMap.getInvalidDependencyVictims(map, [...prvs, ...dups, ...sfds])

    const db: {
      [path: string]: InvalidPackage.ListItem
    } = {}

    for (const victim of [...prvs, ...dups, ...sfds, ...ivls]) {
      const {path} = victim

      if (path in db) {
        const temp = db[path]

        const reason = [
          ...temp.reason,
          ...victim.reason
        ]

        db[path] = {
          ...victim,
          reason
        }
      } else {
        db[path] = {...victim}
      }
    }

    return Object.values(db)
  }

  export namespace fromDependencyMap {
    export function getInvalidDependencyVictims (
      map: Dependency.Map,
      invalids: InvalidPackage.List
    ): ReadonlyArray<getInvalidDependencyVictims.Victim> {
      const newInvalids: getInvalidDependencyVictims.Victim[] = []
      for (const item of invalids) {
        if (newInvalids.some(x => item.path === x.path)) continue
        newInvalids.push(item)
      }

      for (const {list, dependant} of Object.values(map)) {
        const filtered = invalids.filter(
          x => list.some(
            xx => x.manifestContent.name === xx.name
          )
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
      map: Dependency.Map
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

    export function getNameDuplicationVictims (
      map: Dependency.Map
    ): ReadonlyArray<getNameDuplicationVictims.Victim> {
      const result: getNameDuplicationVictims.Victim[] = []

      const duplications = new Set<string>()

      const db: {
        [name: string]: Package.ListItem[]
      } = {}

      for (const {dependant} of Object.values(map)) {
        const {name} = dependant.manifestContent
        if (!name) continue

        if (name in db) {
          duplications.add(name)
          db[name].push(dependant)
        } else {
          db[name] = [dependant]
        }
      }

      for (const dirname of duplications) {
        const list = db[dirname]

        for (const item of list) {
          const reason = [new InvalidPackage.Reason.NameDuplication(list)]
          result.push({...item, reason})
        }
      }

      return result
    }

    export namespace getNameDuplicationVictims {
      export interface Victim extends InvalidPackage.ListItem<
        InvalidPackage.Reason.NameDuplication
      > {}
    }

    export function getSelfDependenceVictims (
      map: Dependency.Map
    ): ReadonlyArray<getSelfDependenceVictims.Victim> {
      const reason = [new InvalidPackage.Reason.SelfDependence()]

      const filter = ({manifestContent: {
        name,
        dependencies = {},
        devDependencies = {},
        peerDependencies = {}
      }}: Package.ListItem) =>
        name && name in {...dependencies, ...devDependencies, ...peerDependencies}

      return Object
        .values(map)
        .map(x => x.dependant)
        .filter(filter)
        .map(x => ({...x, reason}))
    }

    export namespace getSelfDependenceVictims {
      export interface Victim extends InvalidPackage.ListItem<
        InvalidPackage.Reason.SelfDependence
      > {}
    }
  }
}

export default listAllInvalidPackages
