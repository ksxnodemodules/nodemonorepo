import * as assets from 'monorepo-shared-assets'
import createRegistryFactory from './npm-registry'
import listAllPackages from './list-pkgs'

import {
  Package,
  PublishableClassification
} from './types'

export type PartitionResult = Promise<PublishableClassification>

/**
 * Classify packages in directory into 3 groups
 *   - `publishables`: Public packages that can be published (version does not exist in registry)
 *   - `unpublishables`: Public packages that are not publishable (version exists in registry)
 *   - `skip`: Private and/or anonymous packages that are not meant to be published
 * @param dirname Directory that contains all packages
 * @param registry URL origin of registry (e.g. `http://registry.npmjs.org`)
 * @returns The three groups of packages
 */
export async function partition (dirname: string, registry?: string) {
  return partition.fromPackageList(await listAllPackages(dirname), registry)
}

export namespace partition {
  /**
   * Classify packages from list
   * @param list List of packages
   * @param registry URL origin of registry (e.g. `http://registry.npmjs.org`)
   * @returns The three groups of packages
   * @see partition
   */
  export async function fromPackageList (list: Package.List, registry?: string): PartitionResult {
    enum Classification {
      publishable,
      unpublishable,
      skip
    }

    const { getAllVersions } = createRegistryFactory(registry)

    const labeled = await Promise.all(
      list.map(async pkg => {
        const { private: prv, name = '', version } = pkg.manifestContent
        const res = (cls: Classification) => ({ pkg, cls })

        if (prv || !name) return res(Classification.skip)
        if (!version) return res(Classification.unpublishable)

        const published = await getAllVersions(name)
        if (published === 'NotFound') return res(Classification.publishable)
        if (published.versions[version]) return res(Classification.unpublishable)

        return res(Classification.publishable)
      })
    )

    const classification = assets.group.classify.dict.singleDistribute(labeled, x => String(x.cls))

    const getpkgs = (id: Classification) => {
      const list = classification[id]
      return list ? list.map(x => x.pkg) : []
    }

    return {
      publishables: getpkgs(Classification.publishable),
      unpublishables: getpkgs(Classification.unpublishable),
      skip: getpkgs(Classification.skip)
    }
  }

  /**
   * Create a factory base on registry
   * @param registry URL origin of registry (e.g. `http://registry.npmjs.org`)
   * @returns A collection of functions
   */
  export function createFactory (registry?: string) {

    return Object.assign(
      (dirname: string) => partition(dirname, registry),
      {
        fromPackageList: (list: Package.List) => fromPackageList(list, registry)
      }
    )
  }
}

export default partition
