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
  [_: string]: any
}

export type PackageListItem = {
  path: Path,
  manifestFile: Path,
  manifestContent: PackageManifest
}

export type PackageList = PackageListItem[]
