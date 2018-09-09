export interface FactoryCreator {
  (param?: FactoryParam.Registry): Factory.Registry
  (param: FactoryParam.RegistryPackage): Factory.RegistryPackage | Factory.RegistryPackage.Invalid
  (param: FactoryParam.RegistryPackageVersion): Factory.RegistryPackageVersion | Factory.RegistryPackageVersion.Invalid
}

export type FactoryParam =
  FactoryParam.Registry |
  FactoryParam.RegistryPackage |
  FactoryParam.RegistryPackageVersion

export namespace FactoryParam {
  export interface Registry {
    readonly registry?: string
  }

  export interface RegistryPackage extends Registry {
    readonly package: string
  }

  export interface RegistryPackageVersion extends RegistryPackage {
    readonly version: string
  }
}

export type Factory =
  Factory.Registry |
  Factory.RegistryPackage |
  Factory.RegistryPackageVersion

export namespace Factory {
  export interface Base {
    setRegistry (url: string): Registry
  }

  export type Registry =
    Registry.Valid |
    Registry.Invalid

  export namespace Registry {
    export interface Base extends Factory.Base {
      readonly registry: string
    }

    export interface Valid extends Base {
      readonly validRegistry: true
      readonly registryURL: string
      setPackage (name: string): RegistryPackage
    }

    export interface Invalid extends Base {
      readonly validRegistry: false
    }
  }

  export type RegistryPackage =
    RegistryPackage.Valid |
    RegistryPackage.Invalid |
    Registry.Invalid

  export namespace RegistryPackage {
    export interface Base extends Registry.Valid {
      readonly package: string
    }

    export interface Valid extends Base {
      readonly validPackageName: true
      readonly packageURL: string
      readonly latestVersionURL: string
      readonly allVersionsURL: string
      setVersion (version: string): RegistryPackageVersion
    }

    export interface Invalid extends Base {
      readonly validPackageName: false
    }
  }

  export type RegistryPackageVersion =
    RegistryPackageVersion.Valid |
    RegistryPackageVersion.Invalid |
    RegistryPackage.Invalid |
    Registry.Invalid

  export namespace RegistryPackageVersion {
    export interface Base extends RegistryPackage.Valid {
      readonly version: string
    }

    export interface Valid extends Base {
      readonly validVersion: true
      readonly versionURL: string
    }

    export interface Invalid extends Base {
      readonly validVersion: false
    }
  }
}
