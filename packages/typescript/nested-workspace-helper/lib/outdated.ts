import * as path from 'path'
import semver from 'semver'
import * as fsx from 'fs-extra'
import * as assets from 'monorepo-shared-assets'
import listAllPackages from './list-pkgs'
import createRegistry from './npm-registry'

import {
  Basic,
  Package,
  Dependency,
  Outdated,
  PackageVersionRegistry,
  RegistryPackageManifest
} from './types'

/**
 * @param dirname Directory that contains all packages
 * @param options Options
 * @returns List of outdated external dependencies
 */
export async function listOutdatedDependencies (
  dirname: string,
  options?: listOutdatedDependencies.Options
): Promise<Outdated.List> {
  return listOutdatedDependencies.fromPackageList(
    await listAllPackages(dirname),
    options
  )
}

export namespace listOutdatedDependencies {
  /**
   * @param pkgs List of local packages
   * @param options Options
   * @returns List of outdated external dependencies
   */
  export async function fromPackageList (
    pkgs: Package.List,
    options: Options = {}
  ): Promise<Outdated.List> {
    const {
      registry,
      baseOnInstalled = false,
      generateVersionRequirement = DEFAULT_VERREG_GENERATOR,
      transformVersionRequirement = DEFAULT_VERREG_TRANSFORMER
    } = options

    const npmRegistry = createRegistry(registry)
    const localPackageNames = pkgs.map(x => x.manifestContent.name)
    const dependencyNames = new Set<Basic.PackageName>()

    for (const item of pkgs) {
      const {
        dependencies,
        devDependencies,
        peerDependencies
      } = item.manifestContent

      Object.keys({
        ...dependencies,
        ...devDependencies,
        ...peerDependencies
      })
        .filter(x => !localPackageNames.includes(x))
        .forEach(x => dependencyNames.add(x))
    }

    const getDependencyLatestVersions = async () => new Map(
      (
        await Promise.all(
          Array
            .from(dependencyNames)
            .map(x => npmRegistry.getLatestVersion(x))
        )
      )
        .filter(x => x !== 'NotFound')
        .map(x => x as PackageVersionRegistry)
        .map(({ name, version }) => [name, version] as [typeof name, typeof version])
    )

    const getCurrentVersions = baseOnInstalled
      ? async (item: Package.ListItem) => {
        const {
          dependencies = {},
          devDependencies = {},
          peerDependencies = {}
        } = item.manifestContent

        return Promise.all([
          ...transform(dependencies, 'prod'),
          ...transform(devDependencies, 'dev'),
          ...transform(peerDependencies, 'peer')
        ])

        function transform (deps: Package.Dict, type: Dependency.Type) {
          return Object
            .keys(deps)
            .map(async name => ({
              name,
              type,
              requirement: (
                await fsx.readJSON(
                  path.resolve(item.path, 'node_modules', name, 'package.json')
                ) as RegistryPackageManifest
              ).version
            }))
        }
      }
      : async ({ manifestContent }: Package.ListItem) => {
        const {
          dependencies = {},
          devDependencies = {},
          peerDependencies = {}
        } = manifestContent

        return [
          ...transform(dependencies, 'prod'),
          ...transform(devDependencies, 'dev'),
          ...transform(peerDependencies, 'peer')
        ]

        function transform (deps: Package.Dict, type: Dependency.Type) {
          return Object
            .entries(deps)
            .map(([name, requirement]) => ({ name, type, requirement }))
        }
      }

    let result = Array<Outdated.ListItem>()

    const getIterable = async () => Promise.all(
      pkgs.map(async item => ({
        item,
        versions: await getCurrentVersions(item)
      }))
    )

    const [
      dependencyLatestVersions,
      iterable
    ] = await Promise.all([
      getDependencyLatestVersions(),
      getIterable()
    ])

    for (const { item, versions } of iterable) {
      const updatedVersions = versions
        .map(({ requirement, ...rest }) => ({
          ...rest,
          requirement: transformVersionRequirement(requirement),
          latest: dependencyLatestVersions.get(rest.name)
        }))
        .filter(
          ({ latest, requirement }) =>
            latest && !semver.satisfies(latest, requirement)
        )
        .map(item => ({
          ...item,
          update: generateVersionRequirement(item.latest as string)
        }))

      if (!updatedVersions.length) continue

      interface UpdateDictValue {
        [type: string]: Basic.PackageVersionRequirement
      }

      const prod: UpdateDictValue = {}
      const dev: UpdateDictValue = {}
      const peer: UpdateDictValue = {}
      const update = { prod, dev, peer }

      for (const item of updatedVersions) {
        update[item.type][item.name] = item.update
      }

      result.push({ ...item, update })
    }

    return result
  }

  export interface Options {
    /**
     * URL of a Node.js package registry
     */
    readonly registry?: string

    /**
     * Compare to installed packages' versions (in `node_modules` folder) instead of in package.json
     */
    readonly baseOnInstalled?: boolean

    /**
     * Function that takes a version and returns a dependency requirement
     * @param version Dependency's version
     * @returns Corresponding dependency requirement
     */
    readonly generateVersionRequirement?: Outdated.VersionRequirementGenerator

    /**
     * Function that transform version requirements
     * @param requirement Input requirement
     * @returns Output requirement
     */
    readonly transformVersionRequirement?: Outdated.VersionRequirementTransformer
  }

  const DEFAULT_VERREG_GENERATOR: Outdated.VersionRequirementGenerator =
    x => '^' + x

  const DEFAULT_VERREG_TRANSFORMER: Outdated.VersionRequirementTransformer =
    x => assets.constants.regexes.versionRequirement.CARET.test(x) ? x.slice(1) : x
}

export default listOutdatedDependencies
