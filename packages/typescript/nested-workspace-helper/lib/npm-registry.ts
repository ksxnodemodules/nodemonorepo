import {URL} from 'url'
import fetch from 'node-fetch'

import {
  PackageName,
  PackageVersion,
  Registry,
  PackageRegistry,
  PackageVersionRegistry
} from './types'

export const registry = 'http://registry.npmjs.org'

const regurlobj = new URL(registry)

export const mkhref = (segments: string[]) =>
  new URL(segments.join('/'), registry).href

class NetworkError extends Error {
  public readonly name = 'NetworkError'
}

async function getRegistry<Result> (...segments: string[]): Promise<Result> {
  const response = await fetch(mkhref(segments))

  if (!response.ok) {
    throw new NetworkError(
      `Server response with status ${response.status} (${response.statusText}) instead of OK`
    )
  }

  return {...await response.json()}
}

export function getAllVersions (pkg: PackageName): Promise<PackageRegistry> {
  return getRegistry(pkg)
}

export function getSpecificVersion (
  pkg: PackageName,
  version: PackageVersion
): Promise<PackageVersionRegistry> {
  return getRegistry(pkg, version)
}

export function getLatestVersion (pkg: PackageName): Promise<PackageVersionRegistry> {
  return getSpecificVersion(pkg, 'latest')
}

export default {
  getAllVersions,
  getSpecificVersion,
  getLatestVersion
}
