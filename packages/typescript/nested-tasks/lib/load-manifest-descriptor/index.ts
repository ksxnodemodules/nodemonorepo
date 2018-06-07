import {resolve} from 'path'
import yaml from 'monorepo-shared-yaml'

import {
  Manifest,
  TaskSet
} from '../.types'

/**
 * @param descriptor A manifest descriptor
 * @returns A task set
 */
export async function loadManifestDescriptor (
  descriptor: Manifest.Descriptor
): Promise<TaskSet> {
  const manifest = await loadObject(descriptor)

  if (typeof manifest !== 'object') {
    throw new TypeError(`Manifest is not an object: ${manifest}`)
  }

  if (manifest instanceof Array) {
    throw new TypeError(`Manifest is an array: ${JSON.stringify(manifest)}`)
  }

  if (!manifest) {
    throw new TypeError('Manifest is null')
  }

  return new TaskSet(manifest)
}

async function loadObject (descriptor: Manifest.Descriptor): Promise<any> {
  const {type, path} = descriptor

  switch (type) {
    case 'module':
      return require(resolve(path))
    case 'yaml':
      return await yaml.loadFile(path)
  }
}

export default loadManifestDescriptor
