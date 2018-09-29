/**
 * Basic types that other types base upon
 */
export namespace Basic {
  export type Path = string
  export type PackageName = string
  export type PackageVersion = string
  export type PackageVersionRequirement = string
  export type ModulePath = string
}

/**
 * Functions that take `X` and return `Y`
 */
export type Transformer<X, Y> = (x: X) => Y

export namespace Transformer {
  /**
   * Functions that take `Package.ListItem` and return `Y`
   */
  export type FromListItem<Y> = Transformer<Package.ListItem, Y>

  export namespace FromListItem {
    /**
     * Functions that take `Package.ListItem` and return `Package.Manifest`
     */
    export type ToManifest = FromListItem<Package.Manifest>
  }
}

/**
 * Basic types for packages
 */
export namespace Package {
  /**
   * Structure found in `dependencies`, `devDependencies` and `peerDependencies` in `package.json` files
   */
  export interface Dict {
    readonly [name: string]: Basic.PackageVersionRequirement
  }

  /**
   * Structure of `package.json`
   */
  export interface Manifest {
    readonly name?: Basic.PackageName
    readonly version?: Basic.PackageVersion
    readonly private?: boolean
    readonly main?: Basic.ModulePath
    readonly dependencies?: Dict
    readonly devDependencies?: Dict
    readonly peerDependencies?: Dict
    readonly [_: string]: any
  }

  export namespace Manifest {
    export namespace Writer {
      /**
       * Options to be passed to `writePackageManifest`/`writePackageManifest.write`
       */
      export interface Options {
        /**
         * Indentation of `package.json`
         * - As number, it is number of spaces per indentation unit
         * - As string, it is literally indentation unit
         */
        readonly indentation?: string | number

        /**
         * How many final new line to be inserted? Default is 1
         */
        readonly finalNewLine?: number
      }
    }
  }

  /**
   * Returning value of `listAllPackages`
   * @see listAllPackages
   */
  export type List = ReadonlyArray<ListItem>

  export interface ListItem {
    readonly path: Basic.Path
    readonly manifestFile: Basic.Path
    readonly manifestContent: Manifest
  }
}

/**
 * Representation of a dependency listed in `package.json`
 */
export interface Dependency {
  /** Name of dependency, it is property name in dependant's `package.json` dependencies object */
  readonly name: Dependency.Name

  /** Dependency's actual version, it is field `version` in dependency's own `package.json` */
  readonly version: Dependency.Version

  /** Whether dependency is `prod`, `dev`, or `peer` */
  readonly type: Dependency.Type

  /** Requirement of dependency, it is property value in dependant's `package.json` dependencies object */
  readonly requirement: Dependency.Requirement

  /** Other information */
  readonly info: Package.ListItem
}

export namespace Dependency {
  export type Name = Basic.PackageName
  export type Version = Basic.PackageVersion
  export type ManifestField = 'dependencies' | 'devDependencies' | 'peerDependencies'
  export type Type = 'prod' | 'dev' | 'peer'
  export type Requirement = Basic.PackageVersionRequirement

  export type List = ReadonlyArray<Dependency>

  /**
   * Dependant-dependency map within a project (directory)
   *   - Key: Directory that contain dependant's `package.json`
   *   - Value:
   *     - `list`: List of dependencies
   *     - `dependant`: Dependant's information
   */
  export interface Map {
    readonly [dirname: string]: MapValue
  }

  export interface MapValue {
    readonly list: List
    readonly dependant: Package.ListItem
  }
}

export namespace MismatchedDependency {
  export interface ListItem extends Dependency {
    update: Basic.PackageVersionRequirement
  }

  export type List = ReadonlyArray<ListItem>

  export interface MapValue {
    readonly list: List,
    readonly dependant: Package.ListItem
  }

  /**
   * Map of mismatched dependency
   * Structure similar to `DependencyMap`
   * @see DependencyMap
   */
  export interface Map {
    readonly [name: string]: MapValue
  }
}

export namespace Outdated {
  export type List = ReadonlyArray<ListItem>

  export interface ListItem extends Package.ListItem {
    /**
     * Out-of-date dependencies
     */
    readonly update: Update
  }

  /**
   * Contains only out-of-date dependencies
   */
  export interface Update {
    readonly prod: Package.Dict,
    readonly dev: Package.Dict,
    readonly peer: Package.Dict
  }

  /**
   * Function that takes a version and returns a dependency requirement
   * @param version Dependency's version
   * @returns Corresponding dependency requirement
   */
  export type VersionRequirementGenerator = (version: Basic.PackageVersion) => Basic.PackageVersionRequirement

  /**
   * Function that transform version requirements
   * @param requirement Input requirement
   * @returns Output requirement
   */
  export type VersionRequirementTransformer = (requirement: Basic.PackageVersionRequirement) => Basic.PackageVersionRequirement
}

/**
 * Status when interact in network (e.g. Internet)
 */
export type NetworkStatus = NetworkStatus.NotFound

/**
 * Collection of network statuses
 */
export namespace NetworkStatus {
  /** When status code is `404` */
  export type NotFound = 'NotFound'
}

/**
 * Common properties of registry response object
 */
export interface Registry {
  /** Package name */
  readonly name: string

  /** Package description */
  readonly description?: string

  /** Other properties */
  readonly [_: string]: any
}

/**
 * Registry information of a package
 * including all of its versions
 */
export interface PackageRegistry extends Registry {
  readonly versions: RegistryPackageVersionSet
}

export type PackageRegistryResponse = PackageRegistry | NetworkStatus

/**
 * Registry information of a package of a single version
 */
export interface PackageVersionRegistry extends RegistryPackageManifest {}

export type PackageVersionRegistryResponse = PackageVersionRegistry | NetworkStatus

/**
 * All versions of a single package in registry
 */
export interface RegistryPackageVersionSet {
  readonly [version: string]: PackageVersionRegistry
}

/**
 * All packages in registry
 */
export interface RegistryPackageSet {
  readonly [name: string]: PackageRegistry
}

export interface RegistryPackageManifest extends Package.Manifest {
  readonly name: Basic.PackageName
  readonly version: Basic.PackageVersion
}

/** Contains group of publishable, unpublishable and private packages */
export interface PublishableClassification {
  /** Public packages that can be publishes */
  readonly publishables: PublishablePackageList

  /** Public packages that have yet to be publishable */
  readonly unpublishables: UnpublisablePackageList

  /** Private and/or anonymous packages */
  readonly skip: PrivatePackageList
}

export type PublishablePackageList = Package.List
export type UnpublisablePackageList = Package.List
export type PrivatePackageList = Package.List

export namespace InvalidPackage {
  export type List = ReadonlyArray<ListItem>

  export interface ListItem<ReasonElement = Reason> extends Package.ListItem {
    readonly reason: ReadonlyArray<ReasonElement>
  }

  export type Reason =
    Reason.InvalidDependencies |
    Reason.PrivateDependencies |
    Reason.NameDuplication |
    Reason.SelfDependence

  export namespace Reason {
    export abstract class Base {
      /**
       * Information accessible from classes themselve
       */
      static readonly description: Base.Description

      /**
       * Name of reason
       *   - Is the name of class when not compressed
       *   - More reliant than class names
       */
      readonly name: string

      /**
       * Helpful description that can be use as error message
       */
      readonly message: string

      get info () {
        return (this.constructor as typeof Base).description
      }

      constructor () {
        const { description } = this.constructor as typeof Base
        this.name = description.name
        this.message = description.message
      }
    }

    export namespace Base {
      export class Description {
        readonly name: string
        readonly message: string

        constructor (name: string, message: string) {
          this.name = name
          this.message = message
        }
      }
    }

    export class InvalidDependencies extends Base {
      static readonly description = new Base.Description(
        'InvalidDependencies',
        'Package depends on invalid dependencies'
      )

      /**
       * List of invalid dependecies that the package depended on
       */
      readonly dependencies: InvalidDependencies.DependencyList

      /**
       * @param dependencies Intended value of `this.dependencies`
       */
      constructor (dependencies: InvalidDependencies.DependencyList) {
        super()
        this.dependencies = dependencies
      }
    }

    export namespace InvalidDependencies {
      export type DependencyList = ReadonlyArray<ListItem>
    }

    export class PrivateDependencies extends Base {
      static readonly description = new Base.Description(
        'PrivateDependencies',
        'Public package depends on non-dev private dependencies'
      )

      /**
       * List of private dependencies that this package depended on as prod or peer
       */
      readonly dependencies: PrivateDependencies.DependencyList

      /**
       * @param dependencies Intended value of `this.dependencies`
       */
      constructor (dependencies: PrivateDependencies.DependencyList) {
        super()
        this.dependencies = dependencies
      }
    }

    export namespace PrivateDependencies {
      export type DependencyList = ReadonlyArray<Dependency>
    }

    export class NameDuplication extends Base {
      static readonly description = new Base.Description(
        'NameDuplication',
        'Package with name that is used by another package'
      )

      /**
       * List of packages that used the name
       */
      readonly duplicates: NameDuplication.PackageList

      constructor (duplicates: NameDuplication.PackageList) {
        super()
        this.duplicates = duplicates
      }
    }

    export namespace NameDuplication {
      export type PackageList = ReadonlyArray<Package.ListItem>
    }

    export class SelfDependence extends Base {
      static readonly description = new Base.Description(
        'SelfDependence',
        'Package that depends on itself'
      )
    }
  }
}
