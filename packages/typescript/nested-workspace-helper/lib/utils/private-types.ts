import {
  PackageVersionRequirement,
  DependencyMapValue
} from '../types'

export interface WritablePackageDict {
  [name: string]: PackageVersionRequirement
}

export interface WritableDependencyMap {
  [dirname: string]: DependencyMapValue
}
