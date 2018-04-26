import listAllPackages from './list-pkgs'

import {
  DependencyList,
  DependencyMap,
  DependencyType,
  PackageDict,
  PackageList
} from './types'

import {
  WritableDependencyList,
  WritableDependencyMap
} from './utils/private-types'

export type DependencyMapResult = Promise<DependencyMap>

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
  export function fromPackageList (pkgs: PackageList): DependencyMap {
    const result: WritableDependencyMap = {}

    function dict2list (dict: PackageDict, type: DependencyType): DependencyList {
      const result: WritableDependencyList = []

      for (const [name, requirement] of Object.entries(dict)) {
        for (const info of pkgs) {
          const {manifestContent} = info
          if (manifestContent.name !== name) continue
          const {version = '0.0.0'} = manifestContent
          result.push({name, version, type, requirement, info})
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

      result[dependant.path] = {list, dependant}
    }

    return result
  }
}

export default getDependencyMap
