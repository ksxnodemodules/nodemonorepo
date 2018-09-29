import * as fsx from 'fs-extra'
import listOutdatedDependencies from './outdated'
import { deserialize } from './utils/json'

import {
  Package,
  Dependency,
  Outdated
} from './types'

/**
 * Update out-of-date dependencies to match their latest version
 * @param dirname Directory that contains all local packages
 * @param options Options
 */
export async function updateExternalDependencyVersions (
  dirname: string,
  options?: updateExternalDependencyVersions.FullOptions
): Promise<void> {
  await updateExternalDependencyVersions.fromList(
    await listOutdatedDependencies(dirname, options),
    options
  )
}

export namespace updateExternalDependencyVersions {
  /**
   * Update out-of-date dependencies to match their latest version
   * @param list List of update descriptions
   * @param options Options
   */
  export async function fromList (
    list: Outdated.List,
    options: FormatingOptions = {}
  ): Promise<void> {
    const {
      finalNewLine = 1,
      indentation = 2
    } = options

    await Promise.all(
      list.map(async item => {
        const { manifestContent, update } = item
        const newManifest = { ...manifestContent }

        apply('dependencies', 'prod')
        apply('devDependencies', 'dev')
        apply('peerDependencies', 'peer')

        const json = deserialize(newManifest, indentation, finalNewLine)
        await fsx.writeFile(item.manifestFile, json)

        function apply (name: Dependency.ManifestField, type: Dependency.Type) {
          const object = newManifest[name]
          if (!object) return
          Object.assign(object, update[type])
        }
      })
    )
  }

  export type FormatingOptions = Package.Manifest.Writer.Options
  export type FullOptions = listOutdatedDependencies.Options & FormatingOptions
}

export default updateExternalDependencyVersions
