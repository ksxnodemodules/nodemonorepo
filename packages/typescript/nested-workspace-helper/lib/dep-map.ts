import listAllPackages from './list-pkgs'

import {
  Dependency,
  Package
} from './types'

import {
  WritableDependencyList,
  WritableDependencyMap
} from './utils/private-types'

export type DependencyMapResult = Promise<Dependency.Map>

/**
 * @param dirname Directory that contains all packages
 * @returns A dependant-dependency map
 */
export async function getDependencyMap (dirname: string): DependencyMapResult {
  return getDependencyMap.fromPackageList(await listAllPackages(dirname))
}

export namespace getDependencyMap {
  /**
   * Get dependency map from package list
   * @param pkgs List of packages
   * @returns A dependant-dependency map
   */
  export function fromPackageList (pkgs: Package.List): Dependency.Map {
    const result: WritableDependencyMap = {}

    function dict2list (dict: Package.Dict, type: Dependency.Type): Dependency.List {
      const result: WritableDependencyList = []

      for (const [name, requirement] of Object.entries(dict)) {
        for (const info of pkgs) {
          const { manifestContent } = info
          if (manifestContent.name !== name) continue
          const { version = '0.0.0' } = manifestContent
          result.push({ name, version, type, requirement, info })
          break
        }
      }

      return result
    }

    for (const dependant of pkgs) {
      const {
        dependencies = {},
        devDependencies = {},
        peerDependencies = {}
      } = dependant.manifestContent

      const list = [
        ...dict2list(dependencies, 'prod'),
        ...dict2list(devDependencies, 'dev'),
        ...dict2list(peerDependencies, 'peer')
      ]

      result[dependant.path] = { list, dependant }
    }

    return result
  }
}

export default getDependencyMap
