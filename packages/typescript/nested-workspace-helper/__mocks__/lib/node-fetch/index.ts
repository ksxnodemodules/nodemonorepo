import {URL} from 'url'
import * as semver from 'semver'
import {registry} from '../../../lib/npm-registry'
import {packages, PackageVersionRegistry, PackageRegistry} from './lib/data'

export interface Response {
  readonly ok: boolean
  readonly status: number
  readonly statusText: string
  text (): Promise<string>
  json (): Promise<any>
}

const NOT_FOUND_TEXT_FUNC = async () => 'Not Found'
const NOT_FOUND_JSON_FUNC = async () => null

const getSegments = (pathname: string) =>
  pathname.split('/').slice(1)

const latest = (versions: string[]) => versions.reduce(
  (prev, current) =>
    semver.compare(prev, current) === 1 ? prev : current
)

const latestOfPackage = (name: string) =>
  latest(Object.keys(packages[name].versions))

const getAllVersions = ([name]: string[]): PackageRegistry => packages[name]

const getSpecificVersion = (
  [name, version]: string[]
): PackageVersionRegistry =>
  version === 'latest'
    ? getSpecificVersion([name, latestOfPackage(name)])
    : packages[name].versions[version]

const getResponseObject = (segments: string[]) => {
  switch (segments.length) {
    case 1:
      return getAllVersions(segments)
    case 2:
      return getSpecificVersion(segments)
  }

  throw new RangeError('Invalid number of segments')
}

export async function fetch (request: string): Promise<Response> {
  const urlobj = new URL(request)

  if (urlobj.origin !== registry) {
    console.error(`[ERROR] Requested URL ${request} does not belongs to ${registry}`)

    return {
      ok: false,
      status: 404,
      statusText: 'Not Found',
      text: NOT_FOUND_TEXT_FUNC,
      json: NOT_FOUND_JSON_FUNC
    }
  }

  const object = getResponseObject(getSegments(urlobj.pathname))

  const text = async () => JSON.stringify(object, undefined, 2)
  const json = async () => object

  return {
    ok: true,
    status: 200,
    statusText: 'OK',
    text,
    json
  }
}

export default fetch
