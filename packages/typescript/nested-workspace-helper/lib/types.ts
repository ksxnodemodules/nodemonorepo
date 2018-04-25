export type Path = string
export type PackageName = string
export type PackageVersion = string
export type PackageVersionRequirement = string
export type ModulePath = string

export interface PackageDict {
  readonly [name: string]: PackageVersionRequirement
}

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

export type PackageList = ReadonlyArray<PackageListItem>

export type DependencyName = PackageName
export type DependencyVersion = PackageVersion
export type DependencyType = 'prod' | 'dev' | 'peer'
export type DependencyRequirement = PackageVersionRequirement

export interface Dependency {
  readonly name: DependencyName
  readonly version: DependencyVersion
  readonly type: DependencyType
  readonly requirement: DependencyRequirement
  readonly info: PackageListItem
}

export type DependencyList = ReadonlyArray<Dependency>

export interface DependencyMapValue {
  readonly list: DependencyList
  readonly dependant: PackageListItem
}

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

export interface MismatchedDependencyMap {
  readonly [name: string]: MismatchedDependencyMapValue
}

export interface Registry {
  readonly name: string
  readonly description?: string
  readonly [_: string]: any
}

export interface PackageRegistry extends Registry {
  readonly versions: RegistryPackageVersionSet
}

export interface PackageVersionRegistry extends RegistryPackageManifest {}

export interface RegistryPackageVersionSet {
  readonly [version: string]: PackageVersionRegistry
}

export interface RegistryPackageManifest extends PackageManifest {
  readonly version: string
}
