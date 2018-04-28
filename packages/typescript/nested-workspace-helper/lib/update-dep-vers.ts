import * as fsx from 'fs-extra'
import {deserialize} from './utils/json'
import getMismatchedDependencies, {Checker} from './mismatches'

import {
  Package,
  MismatchedDependency
} from './types'

import {
  WritablePackageList
} from './utils/private-types'

import {
  WritablePackageDict
} from './utils/private-types'

/**
 * Update mismatched version requirements
 * @param dirname Directory that contains all packages
 * @param check Corrects version requirement
 * @param jsonIndent JSON indentiation of every `package.json` files
 */
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
  export function fromPackageList (pkgs: Package.List, check: Checker) {
    return fromMismatchedDependencyMap(
      getMismatchedDependencies.fromPackageList(pkgs, check)
    )
  }

  export function fromMismatchedDependencyMap (map: MismatchedDependency.Map) {
    const result: WritablePackageList = []

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
    manifest: Package.Manifest,
    list: MismatchedDependency.List
  ): Package.Manifest {
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
      prev: Package.Dict | void,
      current: Package.Dict
    ): Package.Dict | void => {
      if (prev) return {...prev, ...current}
      if (Object.keys(current).length) return current
      return undefined
    }

    const setDict = (
      name: 'dependencies' | 'devDependencies' | 'peerDependencies',
      dict: Package.Dict
    ): void => {
      const newDict = getDict(manifest[name] as Package.Dict, dict)
      if (newDict) result[name] = newDict
    }

    setDict('dependencies', refs.prod)
    setDict('devDependencies', refs.dev)
    setDict('peerDependencies', refs.peer)

    return result
  }
}

export default updateDependencyVersions
