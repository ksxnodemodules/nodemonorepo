import * as semver from 'semver'
import listAllPackages from './list-pkgs'
import getDependencyMap from './dep-map'

import {
  PackageVersion,
  PackageVersionRequirement,
  PackageList,
  Dependency,
  DependencyType,
  DependencyList,
  DependencyMap,
  MismatchedDependencyList,
  MismatchedDependencyMap
} from './types'

export type Checker = (
  version: PackageVersion,
  range: PackageVersionRequirement,
  type: DependencyType
) => PackageVersionRequirement

export type CheckDependencyResult = Promise<MismatchedDependencyMap>

export async function listMismatchedDependencies (
  dirname: string,
  check: Checker
): CheckDependencyResult {
  return listMismatchedDependencies.fromPackageList(await listAllPackages(dirname), check)
}

export namespace listMismatchedDependencies {
  const mkMinChecker = (prefix: string): Checker =>
    (version, range) => semver.satisfies(version, range) ? range : prefix + version

  const mkCndChecker = (notDev: Checker, dev: Checker): Checker =>
    (version, range, type) => (type === 'dev' ? dev : notDev)(version, range, type)

  export const ANY: Checker = () => '*'
  export const EQUAL: Checker = x => x
  export const TILDA_EQUAL: Checker = x => '~' + x
  export const CARET_EQUAL: Checker = x => '^' + x
  export const EQUAL_MIN = mkMinChecker('')
  export const TILDA_MIN = mkMinChecker('~')
  export const CARET_MIN = mkMinChecker('^')
  export const EQUAL_OR_ANY = mkCndChecker(EQUAL, ANY)
  export const TILDA_EQUAL_OR_ANY = mkCndChecker(TILDA_EQUAL, ANY)
  export const CARET_EQUAL_OR_ANY = mkCndChecker(CARET_EQUAL, ANY)
  export const EQUAL_MIN_OR_ANY = mkCndChecker(EQUAL_MIN, ANY)
  export const TILDA_MIN_OR_ANY = mkCndChecker(TILDA_MIN, ANY)
  export const CARET_MIN_OR_ANY = mkCndChecker(CARET_MIN, ANY)
  export const ANY_OR_EQUAL = mkCndChecker(ANY, EQUAL)
  export const ANY_OR_TILDA_EQUAL = mkCndChecker(ANY, TILDA_EQUAL)
  export const ANY_OR_CARET_EQUAL = mkCndChecker(ANY, CARET_EQUAL)
  export const ANY_OR_EQUAL_MIN = mkCndChecker(ANY, EQUAL_MIN)
  export const ANY_OR_TILDA_MIN = mkCndChecker(ANY, TILDA_MIN)
  export const ANY_OR_CARET_MIN = mkCndChecker(ANY, CARET_MIN)

  export function fromDependencyList (
    dependencies: DependencyList,
    packages: PackageList,
    check: Checker
  ): MismatchedDependencyList {
    return dependencies.map(dependency => ({
      update: check(dependency.version, dependency.requirement, dependency.type),
      ...dependency
    }))
  }

  export function fromDependencyMap (
    map: DependencyMap,
    packages: PackageList,
    check: Checker
  ): MismatchedDependencyMap {
    return Object
      .entries(map)
      .map(([path, list]) => ({path, list: fromDependencyList(list, packages, check)}))
      .reduce((obj, {path, list}) => Object.assign(obj, {[path]: list}), {})
  }

  export function fromPackageList (
    pkgs: PackageList,
    check: Checker
  ): MismatchedDependencyMap {
    const map = getDependencyMap.fromPackageList(pkgs)
    return fromDependencyMap(map, pkgs, check)
  }
}

export default listMismatchedDependencies
