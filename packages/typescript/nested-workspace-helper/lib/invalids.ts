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
    const dups = fromDependencyMap.getNameDuplicationVictims(map)
    const sfds = fromDependencyMap.getSelfDependenceVictims(map)
    const ivls = fromDependencyMap.getInvalidDependencyVictims(map, [...prvs, ...dups, ...sfds])

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
        const filtered = invalids
          .filter(
            x => x.reason.map(
              xx => xx instanceof InvalidPackage.Reason.NameDuplication
            ).length === 0
          )
          .filter(
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

    export function getNameDuplicationVictims (
      map: DependencyMap
    ): ReadonlyArray<getNameDuplicationVictims.Victim> {
      const result: getNameDuplicationVictims.Victim[] = []

      const duplications = new Set<string>()

      const db: {
        [name: string]: PackageListItem[]
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

      for (const name of duplications) {
        const list = db[name]

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
      map: DependencyMap
    ): ReadonlyArray<getSelfDependenceVictims.Victim> {
      const reason = [new InvalidPackage.Reason.SelfDependence()]

      const filter = ({manifestContent: {
        name,
        dependencies = {},
        devDependencies = {},
        peerDependencies = {}
      }}: PackageListItem) =>
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
