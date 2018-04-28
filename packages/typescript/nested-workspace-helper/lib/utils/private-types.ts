import {
  Package,
  Basic,
  Dependency
} from '../types'

export type WritablePackageList = Package.ListItem[]
export type WritableDependencyList = Dependency[]

export interface WritablePackageDict {
  [name: string]: Basic.PackageVersionRequirement
}

export interface WritableDependencyMap {
  [dirname: string]: Dependency.MapValue
}
