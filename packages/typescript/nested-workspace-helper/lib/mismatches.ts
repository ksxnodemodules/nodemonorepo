import * as semver from 'semver'
import listAllPackages from './list-pkgs'
import getDependencyMap from './dep-map'

import {
  Basic,
  Package,
  Dependency,
  MismatchedDependency
} from './types'

/**
 * Function that corrects version requirement
 * @param version Dependency's actual version
 * @param range Dependency's old version requirement
 * @param type Whether dependency is `prod`, `dev` or `peer`
 */
export type Checker = (
  version: Basic.PackageVersion,
  range: Basic.PackageVersionRequirement,
  type: Dependency.Type
) => Basic.PackageVersionRequirement

export interface CheckerCollection {
  readonly [name: string]: Checker
}

export type CheckDependencyResult = Promise<MismatchedDependency.Map>

/**
 * List all mismatched dependencies
 * @param dirname Directory that contains all packages
 * @param check Corrects mismatched version requirement
 * @returns A map of updated dependency
 */
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
  export const TILDE_EQUAL: Checker = x => '~' + x
  export const CARET_EQUAL: Checker = x => '^' + x
  export const EQUAL_MIN = mkMinChecker('')
  export const TILDE_MIN = mkMinChecker('~')
  export const CARET_MIN = mkMinChecker('^')
  export const EQUAL_OR_ANY = mkCndChecker(EQUAL, ANY)
  export const TILDE_EQUAL_OR_ANY = mkCndChecker(TILDE_EQUAL, ANY)
  export const CARET_EQUAL_OR_ANY = mkCndChecker(CARET_EQUAL, ANY)
  export const EQUAL_MIN_OR_ANY = mkCndChecker(EQUAL_MIN, ANY)
  export const TILDE_MIN_OR_ANY = mkCndChecker(TILDE_MIN, ANY)
  export const CARET_MIN_OR_ANY = mkCndChecker(CARET_MIN, ANY)
  export const ANY_OR_EQUAL = mkCndChecker(ANY, EQUAL)
  export const ANY_OR_TILDE_EQUAL = mkCndChecker(ANY, TILDE_EQUAL)
  export const ANY_OR_CARET_EQUAL = mkCndChecker(ANY, CARET_EQUAL)
  export const ANY_OR_EQUAL_MIN = mkCndChecker(ANY, EQUAL_MIN)
  export const ANY_OR_TILDE_MIN = mkCndChecker(ANY, TILDE_MIN)
  export const ANY_OR_CARET_MIN = mkCndChecker(ANY, CARET_MIN)

  export const prvAllCheckers = {
    ANY,
    EQUAL, TILDE_EQUAL, CARET_EQUAL,
    EQUAL_MIN, TILDE_MIN, CARET_MIN,
    EQUAL_OR_ANY, TILDE_EQUAL_OR_ANY, CARET_EQUAL_OR_ANY,
    EQUAL_MIN_OR_ANY, TILDE_MIN_OR_ANY, CARET_MIN_OR_ANY,
    ANY_OR_EQUAL, ANY_OR_TILDE_EQUAL, ANY_OR_CARET_EQUAL,
    ANY_OR_EQUAL_MIN, ANY_OR_TILDE_MIN, ANY_OR_CARET_MIN
  }

  export type PrvCheckerCollection = Readonly<typeof prvAllCheckers>
  export interface AllCheckerCollection extends CheckerCollection, PrvCheckerCollection {}

  /** Collection of all checkers */
  export const allCheckers: AllCheckerCollection = prvAllCheckers

  export function fromDependencyList (
    dependencies: Dependency.List,
    check: Checker
  ): MismatchedDependency.List {
    return dependencies.map(dependency => ({
      update: check(dependency.version, dependency.requirement, dependency.type),
      ...dependency
    }))
  }

  export function fromDependencyMap (
    map: Dependency.Map,
    check: Checker
  ): MismatchedDependency.Map {
    return Object
      .entries(map)
      .map(
        ([path, { list, dependant }]) =>
          ({ path, dependant, list: fromDependencyList(list, check) })
      )
      .reduce(
        (obj, { path, list, dependant }) =>
          Object.assign(obj, { [path]: { list, dependant } }),
        {} as MismatchedDependency.Map
      )
  }

  export function fromPackageList (
    pkgs: Package.List,
    check: Checker
  ): MismatchedDependency.Map {
    const map = getDependencyMap.fromPackageList(pkgs)
    return fromDependencyMap(map, check)
  }
}

export default listMismatchedDependencies
