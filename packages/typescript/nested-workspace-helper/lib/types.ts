export type Path = string
export type PackageName = string
export type PackageVersion = string
export type PackageVersionRequirement = string
export type ModulePath = string

/**
 * Structure found in `dependencies`, `devDependencies` and `peerDependencies` in `package.json` files
 */
export interface PackageDict {
  readonly [name: string]: PackageVersionRequirement
}

/**
 * Structure of `package.json`
 */
export interface PackageManifest {
  readonly name?: PackageName
  readonly version?: PackageVersion
  readonly private?: boolean
  readonly main?: ModulePath
  readonly dependencies?: PackageDict
  readonly devDependencies?: PackageDict
  readonly peerDependencies?: PackageDict
  readonly [_: string]: any
}

export interface PackageListItem {
  readonly path: Path
  readonly manifestFile: Path
  readonly manifestContent: PackageManifest
}

/**
 * Returning value of `listAllPackages`
 * @see listAllPackages
 */
export type PackageList = ReadonlyArray<PackageListItem>

export type DependencyName = PackageName
export type DependencyVersion = PackageVersion
export type DependencyType = 'prod' | 'dev' | 'peer'
export type DependencyRequirement = PackageVersionRequirement

/**
 * Representation of a dependency listed in `package.json`
 */
export interface Dependency {
  /** Name of dependency, it is property name in dependant's `package.json` dependencies object */
  readonly name: DependencyName

  /** Dependency's actual version, it is field `version` in dependency's own `package.json` */
  readonly version: DependencyVersion

  /** Whether dependency is `prod`, `dev`, or `peer` */
  readonly type: DependencyType

  /** Requirement of dependency, it is property value in dependant's `package.json` dependencies object */
  readonly requirement: DependencyRequirement

  /** Other information */
  readonly info: PackageListItem
}

export type DependencyList = ReadonlyArray<Dependency>

export interface DependencyMapValue {
  readonly list: DependencyList
  readonly dependant: PackageListItem
}

/**
 * Dependant-dependency map within a project (directory)
 *   - Key: Directory that contain dependant's `package.json`
 *   - Value:
 *     - `list`: List of dependencies
 *     - `dependant`: Dependant's information
 */
export interface DependencyMap {
  readonly [dirname: string]: DependencyMapValue
}

export interface MismatchedDependencyListItem extends Dependency {
  update: PackageVersionRequirement
}

export type MismatchedDependencyList = ReadonlyArray<MismatchedDependencyListItem>

export interface MismatchedDependencyMapValue {
  readonly list: MismatchedDependencyList,
  readonly dependant: PackageListItem
}

/**
 * Map of mismatched dependency
 * Structure similar to `DependencyMap`
 * @see DependencyMap
 */
export interface MismatchedDependencyMap {
  readonly [name: string]: MismatchedDependencyMapValue
}

/**
 * Status when interact in network (e.g. Internet)
 */
export type NetworkStatus = NetworkStatus.NotFound

/**
 * Collection of network statuses
 */
export namespace NetworkStatus {
  /** When status code is `404` */
  export type NotFound = 'NotFound'
}

/**
 * Common properties of registry response object
 */
export interface Registry {
  /** Package name */
  readonly name: string

  /** Package description */
  readonly description?: string

  /** Other properties */
  readonly [_: string]: any
}

/**
 * Registry information of a package
 * including all of its versions
 */
export interface PackageRegistry extends Registry {
  readonly versions: RegistryPackageVersionSet
}

export type PackageRegistryResponse = PackageRegistry | NetworkStatus

/**
 * Registry information of a package of a single version
 */
export interface PackageVersionRegistry extends RegistryPackageManifest {}

export type PackageVersionRegistryResponse = PackageVersionRegistry | NetworkStatus

/**
 * All versions of a single package in registry
 */
export interface RegistryPackageVersionSet {
  readonly [version: string]: PackageVersionRegistry
}

/**
 * All packages in registry
 */
export interface RegistryPackageSet {
  readonly [name: string]: PackageRegistry
}

export interface RegistryPackageManifest extends PackageManifest {
  readonly version: string
}

/** Contains group of publishable, unpublishable and private packages */
export interface PublishableClassification {
  /** Public packages that can be publishes */
  readonly publishables: PublishablePackageList

  /** Public packages that have yet to be publishable */
  readonly unpublishables: UnpublisablePackageList

  /** Private and/or anonymous packages */
  readonly skip: PrivatePackageList
}

export type PublishablePackageList = PackageList
export type UnpublisablePackageList = PackageList
export type PrivatePackageList = PackageList
