import * as fsx from 'fs-extra'
import {deserialize} from './utils/json'
import getMismatchedDependencies, {Checker} from './mismatches'

import {
  PackageList,
  PackageListItem,
  PackageDict,
  PackageManifest,
  MismatchedDependencyMap,
  MismatchedDependencyList
} from './types'

import {
  WritablePackageDict
} from './utils/private-types'

export async function updateDependencyVersions (
  dirname: string,
  check: Checker,
  jsonIndent: number | string = 2
) {
  await Promise.all(
    updateDependencyVersions.fromMismatchedDependencyMap(
      await getMismatchedDependencies(dirname, check)
    ).map(item => fsx.writeFile(
      item.manifestFile,
      deserialize(item.manifestContent, jsonIndent)
    ))
  )
}

export namespace updateDependencyVersions {
  export function fromPackageList (pkgs: PackageList, check: Checker) {
    return fromMismatchedDependencyMap(
      getMismatchedDependencies.fromPackageList(pkgs, check)
    )
  }

  export function fromMismatchedDependencyMap (map: MismatchedDependencyMap) {
    const result: PackageList = []

    for (const {dependant, list} of Object.values(map)) {
      result.push({
        ...dependant,
        manifestContent: updateDependencies(
          dependant.manifestContent,
          list
        )
      })
    }

    return result
  }

  export function updateDependencies (
    manifest: PackageManifest,
    list: MismatchedDependencyList
  ): PackageManifest {
    const refs: {
      [_: string]: WritablePackageDict
    } = {
      prod: {},
      dev: {},
      peer: {}
    }

    for (const {type, name, update} of list) {
      refs[type][name] = update
    }

    const result = {...manifest}

    const getDict = (
      prev: PackageDict | void,
      current: PackageDict
    ): PackageDict | void => {
      if (prev) return {...prev, ...current}
      if (Object.keys(current).length) return current
      return undefined
    }

    const setDict = (
      name: 'dependencies' | 'devDependencies' | 'peerDependencies',
      dict: PackageDict
    ): void => {
      const newDict = getDict(manifest[name] as PackageDict, dict)
      if (newDict) result[name] = newDict
    }

    setDict('dependencies', refs.prod)
    setDict('devDependencies', refs.dev)
    setDict('peerDependencies', refs.peer)

    return result
  }
}

export default updateDependencyVersions
