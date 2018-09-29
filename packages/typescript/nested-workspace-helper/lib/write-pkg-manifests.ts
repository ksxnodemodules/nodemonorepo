import * as fsx from 'fs-extra'
import { deserialize } from './utils/json'
import listAllPackages from './list-pkgs'

import {
  Package,
  Transformer as Trsfmr
} from './types'

/**
 * Re-format `package.json` files
 * @param dirname Path to directory that contains all packages
 * @param transformer Function takes a `Package.ListItem` and returns a `Package.Manifest`
 * @param options.indentation Intended JSON indent
 * @param options.finalNewLine How many final new lines
 */
export async function writePackageManifests (
  dirname: string,
  transformer: writePackageManifests.Transformer,
  options?: Package.Manifest.Writer.Options
) {
  const input = await writePackageManifests.read(dirname)
  const output = writePackageManifests.transform(input, transformer)
  await writePackageManifests.write(output, options)
}

export namespace writePackageManifests {
  export const read = listAllPackages

  /**
   * Write information from `list` into various `package.json` files
   * @param list List of packages
   * @param options.indentation Intended JSON indent
   * @param options.finalNewLine How many final new lines
   */
  export async function write (
    list: Package.List,
    options: Package.Manifest.Writer.Options = {}
  ) {
    const allPromises = list.map(
      item => fsx.writeFile(
        item.manifestFile,
        deserialize(item.manifestContent, options.indentation, options.finalNewLine)
      )
    )

    await Promise.all(allPromises)
  }

  export function transform (
    list: Package.List,
    transformer: Transformer
  ): Package.List {
    return list.map(item => ({
      ...item,
      manifestContent: transformer(item)
    }))
  }

  export type Transformer = Trsfmr.FromListItem.ToManifest
}

export default writePackageManifests
