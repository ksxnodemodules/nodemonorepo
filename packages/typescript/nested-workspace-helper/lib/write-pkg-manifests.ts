import * as fsx from 'fs-extra'
import {deserialize} from './utils/json'
import listAllPackages from './list-pkgs'

import {
  Package,
  Transformer as Trsfmr
} from './types'

export async function writePackageManifests (
  dirname: string,
  transformer: writePackageManifests.Transformer,
  options?: Package.Manifest.Writer.Options
) {
  const input = await writePackageManifests.read(dirname)
  const output = writePackageManifests.transform(input, transformer)
  await writePackageManifests.write(dirname, output, options)
}

export namespace writePackageManifests {
  export const read = listAllPackages

  export async function write (
    dirname: string,
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
