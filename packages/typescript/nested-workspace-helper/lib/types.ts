export type Path = string
export type PackageName = string
export type PackageVersion = string
export type PackageVersionRequirement = string
export type ModulePath = string

export type PackageDict = {
  [name: string]: PackageVersionRequirement
}

export type PackageManifest = {
  name?: PackageName,
  version?: PackageVersion,
  private?: boolean,
  main?: ModulePath,
  dependencies?: PackageDict,
  devDependencies?: PackageDict,
  peerDependencies?: PackageDict,
  [_: string]: any
}

export type PackageListItem = {
  path: Path,
  manifestFile: Path,
  manifestContent: PackageManifest
}

export type PackageList = PackageListItem[]

export type DependencyName = PackageName
export type DependencyVersion = PackageVersion
export type DependencyType = 'prod' | 'dev' | 'peer'
export type DependencyRequirement = PackageVersionRequirement

export type Dependency = {
  name: DependencyName,
  version: DependencyVersion,
  type: DependencyType,
  requirement: DependencyRequirement,
  info: PackageListItem
}

export type DependencyList = Dependency[]

export type DependencyMapValue = {
  list: DependencyList,
  dependant: PackageListItem
}

export type DependencyMap = {
  [dirname: string]: DependencyMapValue
}

export type MismatchedDependencyListItem = Dependency & {
  update: PackageVersionRequirement
}

export type MismatchedDependencyList = MismatchedDependencyListItem[]

export type MismatchedDependencyMapValue = {
  list: MismatchedDependencyList,
  dependant: PackageListItem
}

export type MismatchedDependencyMap = {
  [name: string]: MismatchedDependencyList
}
