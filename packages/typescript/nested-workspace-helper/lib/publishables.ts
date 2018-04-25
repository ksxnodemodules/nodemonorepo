import ramda from 'ramda'
import createRegistryFactory from './npm-registry'
import listAllPackages from './list-pkgs'

import {
  PackageList,
  PackageListItem,
  PackageRegistryResponse,
  PublishableClassification
} from './types'

export type PartitionResult = Promise<PublishableClassification>

/**
 * Classify packages in directory into 3 groups
 *   - `publishables`: Public packages that can be published (version does not exist in registry)
 *   - `unpublishables`: Public packages that are not publishable (version exists in registry)
 *   - `skip`: Private and/or anonymous packages that are not meant to be published
 */
export async function partition (dirname: string, registry?: string) {
  return partition.fromPackageList(await listAllPackages(dirname), registry)
}

export namespace partition {
  /**
   * Classify packages from list
   * @see partition
   */
  export async function fromPackageList (list: PackageList, registry?: string): PartitionResult {
    enum Classification {
      publishable,
      unpublishable,
      skip
    }

    const {getAllVersions} = createRegistryFactory(registry)

    const classified = await Promise.all(
      list.map(async pkg => {
        const {private: prv, name = '', version} = pkg.manifestContent
        const res = (cls: Classification) => ({pkg, cls})

        if (prv || !name) return res(Classification.skip)
        if (!version) return res(Classification.unpublishable)

        const published = await getAllVersions(name)
        if (published === 'NotFound') return res(Classification.publishable)
        if (published.versions[version]) return res(Classification.unpublishable)

        return res(Classification.publishable)
      })
    )

    const [skip, notskip] = ramda.partition(
      x => x.cls === Classification.skip,
      classified
    )

    const [publishables, unpublishables] = ramda.partition(
      x => x.cls === Classification.publishable,
      notskip
    )

    const getpkg = (x: {
      pkg: PackageListItem
    }) => x.pkg

    return {
      publishables: publishables.map(getpkg),
      unpublishables: unpublishables.map(getpkg),
      skip: skip.map(getpkg)
    }
  }

  /**
   * Create a factory base on registry
   */
  export function createFactory (registry?: string) {
    const param: [typeof registry] = [registry]

    return Object.assign(
      ramda.partialRight(partition, param),
      {
        fromPackageList: ramda.partialRight(fromPackageList, param)
      }
    )
  }
}

export default partition
