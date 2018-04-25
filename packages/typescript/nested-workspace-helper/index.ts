import listAllPackages from './lib/list-pkgs'
import getDependencyMap from './lib/dep-map'
import listMismatchedDependencies from './lib/mismatches'
import updateDependencyVersions from './lib/update-dep-vers'
import npmRegistry from './lib/npm-registry'

export * from './lib/types'

export {
  listAllPackages,
  getDependencyMap,
  listMismatchedDependencies,
  updateDependencyVersions,
  npmRegistry
}
