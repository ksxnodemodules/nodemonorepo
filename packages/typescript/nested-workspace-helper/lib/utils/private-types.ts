import {
  PackageListItem,
  PackageVersionRequirement,
  Dependency,
  DependencyMapValue
} from '../types'

export type WritablePackageList = PackageListItem[]
export type WritableDependencyList = Dependency[]

export interface WritablePackageDict {
  [name: string]: PackageVersionRequirement
}

export interface WritableDependencyMap {
  [dirname: string]: DependencyMapValue
}
