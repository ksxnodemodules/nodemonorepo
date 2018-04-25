import {
  PackageRegistry,
  PackageVersionRegistry,
  RegistryPackageSet,
  RegistryPackageVersionSet
} from '../../../../lib/types'

const pkgVers = require('../data/pkg-vers.yaml') as Readonly<{
  [name: string]: ReadonlyArray<string>
}>

export {
  PackageRegistry,
  PackageVersionRegistry,
  RegistryPackageSet,
  RegistryPackageVersionSet
}

export const packages = Object
  .entries(pkgVers)
  .map(([name, versions]) => ({
    name,
    versions: versions
      .map(
        version =>
          ({name, version} as PackageVersionRegistry)
      )
      .reduce(
        (prev, current) => Object.assign(prev, {[current.version]: current}),
        {} as RegistryPackageVersionSet
      )
  } as PackageRegistry))
  .reduce(
    (prev, current) => Object.assign(prev, {[current.name]: current}),
    {} as RegistryPackageSet
  )
