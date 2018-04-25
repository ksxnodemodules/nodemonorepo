import {URL} from 'url'
import fetch from 'node-fetch'

import {
  PackageName,
  PackageVersion,
  NetworkStatus,
  Registry,
  PackageRegistryResponse,
  PackageVersionRegistryResponse
} from './types'

export const NPM_REGISTRY = 'http://registry.npmjs.org'
export const YARN_REGISTRY = 'https://registry.yarnpkg.com'

export const mkhref = (
  segments: string[],
  registry: string
) => new URL(segments.join('/'), registry).href

class NetworkError extends Error {
  public readonly name = 'NetworkError'
}

export function createFactory (registry: string = NPM_REGISTRY) {
  async function getRegistry<Result> (...segments: string[]): Promise<Result | NetworkStatus> {
    const response = await fetch(mkhref(segments, registry))

    if (!response.ok) {
      if (response.status === 404) {
        return 'NotFound'
      }

      throw new NetworkError(
        `Server response with status ${response.status} (${response.statusText}) instead of OK`
      )
    }

    return {...await response.json()}
  }

  function getAllVersions (pkg: PackageName): Promise<PackageRegistryResponse> {
    return getRegistry(pkg)
  }

  function getSpecificVersion (
    pkg: PackageName,
    version: PackageVersion
  ): Promise<PackageVersionRegistryResponse> {
    return getRegistry(pkg, version)
  }

  function getLatestVersion (pkg: PackageName): Promise<PackageVersionRegistryResponse> {
    return getSpecificVersion(pkg, 'latest')
  }

  return {
    registry,
    getRegistry,
    getAllVersions,
    getSpecificVersion,
    getLatestVersion
  }
}

export namespace createFactory {
  export const REGISTRIES = {
    NPM: NPM_REGISTRY,
    YARN: YARN_REGISTRY
  }

  export const npm = createFactory(NPM_REGISTRY)
  export const yarn = createFactory(YARN_REGISTRY)
}

export default createFactory
