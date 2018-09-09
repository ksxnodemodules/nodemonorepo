import createFactory, {
  FactoryParam,
  NPM_REGISTRY,
  YARN_REGISTRY,
  encodePackageName,
  validRegistry,
  validPackageName,
  validVersion
} from '../index'

describe('createFactory', () => {
  describe('when param is valid', () => {
    function nofn (param?: FactoryParam) {
      const base = createFactory(param)

      const result: {
        [_: string]: string
      } = {}

      for (const [key, value] of Object.entries(base)) {
        result[key] = typeof value === 'function' ? '[Function]' : value
      }

      return result
    }

    describe('when param is undefined', () => {
      it('should work', () => {
        expect(nofn()).toEqual(nofn({}))
      })
    })

    describe('when param.registry is undefined', () => {
      it('should use npm registry', () => {
        expect(nofn({})).toEqual(nofn({
          registry: NPM_REGISTRY
        }))
      })
    })

    describe('when param.registry is specified', () => {
      it('npm', () => {
        expect(createFactory({
          registry: NPM_REGISTRY
        })).toMatchSnapshot()
      })

      it('yarn', () => {
        expect(createFactory({
          registry: YARN_REGISTRY
        })).toMatchSnapshot()
      })
    })

    describe('when param.package is specified', () => {
      it('without param.registry', () => {
        expect(createFactory({
          package: 'package'
        })).toMatchSnapshot()
      })

      it('with param.registry', () => {
        expect(createFactory({
          registry: NPM_REGISTRY,
          package: 'package'
        })).toMatchSnapshot()
      })

      it('scoped', () => {
        expect(createFactory({
          package: '@scope/package'
        })).toMatchSnapshot()
      })
    })

    describe('when param.package and param.version is specified', () => {
      it('without param.registry', () => {
        expect(createFactory({
          package: 'package',
          version: '1.2.3'
        })).toMatchSnapshot()
      })

      it('with param.registry', () => {
        expect(createFactory({
          registry: NPM_REGISTRY,
          package: 'package',
          version: '1.2.3'
        })).toMatchSnapshot()
      })
    })
  })

  describe('when param is invalid', () => {
    it('because of param.registry', () => {
      expect(createFactory({
        registry: 'Invalid Registry!'
      })).toMatchSnapshot()
    })

    it('because of param.package', () => {
      expect(createFactory({
        package: '!@#$%^'
      })).toMatchSnapshot()
    })

    it('because of param.version', () => {
      expect(createFactory({
        package: 'package',
        version: 'Invalid Version Syntax!'
      })).toMatchSnapshot()
    })
  })
})

describe('Other functions', () => {
  function map<Right> (
    list: string[],
    fn: (x: string) => Right
  ): {
    readonly [_: string]: Right
  } {
    let result: {[_: string]: Right} = {}

    for (const item of list) {
      result[item] = fn(item)
    }

    return result
  }

  it('encodePackageName', () => {
    expect(map(
      [
        'package',
        '@scope/package'
      ],
      encodePackageName
    )).toMatchSnapshot()
  })

  it('validRegistry', () => {
    expect(map(
      [
        NPM_REGISTRY,
        YARN_REGISTRY,
        'Invalid Registry!'
      ],
      validRegistry
    )).toEqual({
      [NPM_REGISTRY]: true,
      [YARN_REGISTRY]: true,
      'Invalid Registry!': false
    })
  })

  it('validPackageName', () => {
    expect(map(
      [
        'package',
        '@scope/package',
        'Invalid Package Name!'
      ],
      validPackageName
    )).toEqual({
      'package': true,
      '@scope/package': true,
      'Invalid Package Name!': false
    })
  })

  it('validVersion', () => {
    expect(map(
      [
        '0.1.2',
        '1.2.3',
        'v3', // expect: invalid
        'Invalid Version!'
      ],
      validVersion
    )).toEqual({
      '0.1.2': true,
      '1.2.3': true,
      'v3': false,
      'Invalid Version!': false
    })
  })
})
