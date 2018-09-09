import {URL} from 'url'

import {
  NPM_REGISTRY
} from '../../constants'

import {
  FactoryCreator,
  FactoryParam,
  Factory
} from '../../types'

import validRegistry from '../valid-registry'
import validPkg from '../valid-pkg-name'
import validVersion from '../valid-version'
import encodePkgName from '../encode-pkg-name'

const joinURL = (href: string, tail: string) => new URL(href + '/' + tail).href

function createRegistryFactory (
  param: FactoryParam.Registry = {}
): Factory.Registry {
  const {
    registry = NPM_REGISTRY
  } = param

  const setRegistry = (registry: string) => createFactory({...param, registry})

  if (!validRegistry(registry)) {
    return {
      validRegistry: false,
      registry,
      setRegistry
    }
  }

  const setPackage = (name: string) => createFactory({...param, registry, package: name})

  return {
    validRegistry: true,
    registry,
    registryURL: registry,
    setRegistry,
    setPackage
  }
}

function createRegistryPackageFactory (
  param: FactoryParam.RegistryPackage
): Factory.RegistryPackage {
  const base = createRegistryFactory(param)
  const pkgName = param.package

  if (!validPkg(pkgName)) {
    return {
      ...base,
      validPackageName: false,
      package: pkgName
    }
  }

  const packageURL = joinURL(base.registry, encodePkgName(pkgName))
  const latestVersionURL = joinURL(packageURL, 'latest')
  const allVersionsURL = joinURL(packageURL, 'versions')
  const setVersion = (version: string) => createFactory({...param, version})

  return {
    ...base,
    validPackageName: true,
    package: pkgName,
    packageURL,
    latestVersionURL,
    allVersionsURL,
    setVersion
  }
}

function createRegistryPackageVersionFactory (
  param: FactoryParam.RegistryPackageVersion
): Factory.RegistryPackageVersion {
  const base = createRegistryPackageFactory(param)

  if (!base.validRegistry || !base.validPackageName) return base

  const {version} = param

  if (!validVersion(version)) {
    return {
      ...base,
      validVersion: false,
      version
    }
  }

  const versionURL = joinURL(base.packageURL, version)

  return {
    ...base,
    validVersion: true,
    version,
    versionURL
  }
}

const createFactory: FactoryCreator = (param?: FactoryParam): any => {
  if (!param || !param.registry) return createRegistryFactory()

  if ('package' in param) {
    return 'version' in param
      ? createRegistryPackageVersionFactory(param)
      : createRegistryPackageFactory(param)
  }

  return createRegistryFactory(param)
}

export = createFactory
