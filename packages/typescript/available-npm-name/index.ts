import fetch from 'node-fetch'
import createURLs, {validRegistry} from 'assemble-registry-url'

export enum Status {
  Available,
  Occupied,
  NetworkError,
  InvalidRegistry,
  InvalidName
}

export async function single (name: string, registry?: string): Promise<Status> {
  const urls = createURLs({
    registry,
    package: name
  })

  if (!urls.validRegistry) return Status.InvalidRegistry
  if (!urls.validPackageName) return Status.InvalidName

  const {ok, status} = await fetch(urls.packageURL)
  if (ok || status === 200) return Status.Occupied
  if (status === 404) return Status.Available
  return Status.NetworkError
}

export async function multiple (
  names: string[],
  registry?: string
): Promise<ReadonlyArray<Status> | Status.InvalidRegistry> {
  return !registry || validRegistry(registry)
    ? Promise.all(names.map(name => single(name, registry)))
    : Status.InvalidRegistry
}

export default multiple
