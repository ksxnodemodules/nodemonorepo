import * as path from 'path'
import {env} from 'process'
import ramda from 'ramda'
import * as subject from '../lib/index'
import {PathFactory, PathArray, PathDelimiter, Env, EnvFactory} from '../lib/index'

function sharedUnit (factory: PathFactory, array: PathArray, delim: PathDelimiter) {
  expect(factory.get.array()).toEqual(array)
  expect(factory.get.string()).toBe(array.join(delim))
  expect(factory.get.delim()).toBe(delim)
}

function testPathFactory (getFactory: () => PathFactory, array: PathArray, delim: PathDelimiter) {
  const unit = ramda.partialRight(sharedUnit, [delim])

  describe('returns a factory', () => {
    it('that has correct data', () => unit(getFactory(), array))

    describe('when alter a property', () => {
      it('which is `array`', () => unit(
        getFactory().set.array(['altered', 'array']),
        ['altered', 'array']
      ))

      it('which is `string`', () => unit(
        getFactory().set.string(['altered', 'string'].join(delim)),
        ['altered', 'string']
      ))
    })

    describe('when adding new part', () => {
      it('to its tail', () => unit(
        getFactory().append(['this', 'is', 'tail']),
        [...array, 'this', 'is', 'tail']
      ))

      it('to its head', () => unit(
        getFactory().prepend(['this', 'is', 'head']),
        ['this', 'is', 'head', ...array]
      ))

      it('to both of its ends', () => unit(
        getFactory().surround(['head', 'or', 'tail']),
        ['head', 'or', 'tail', ...array, 'head', 'or', 'tail']
      ))
    })
  })
}

function testEnvFactory (getFactory: () => EnvFactory, env: Env, name: string, delim: PathDelimiter) {
  const array = (env[name] as string).split(delim)

  function unit (factory: EnvFactory, array: PathArray, delim: PathDelimiter, expected: Env) {
    const pathFactory = factory.path.get.factory()
    sharedUnit(pathFactory, array, delim)
    expect(factory.get.env()).toEqual(expected)
    expect(factory.path.get.array()).toBe(pathFactory.get.array())
    expect(factory.path.get.string()).toBe(pathFactory.get.string())
    expect(factory.path.get.delim()).toBe(pathFactory.get.delim())
  }

  describe('returns a factory', () => {
    it('has correct data', () => unit(getFactory(), array, delim, env))
  })

  describe('when alter a property', () => {
    it('which is path as array', () => unit(
      getFactory().path.set.array(['altered', 'array']),
      ['altered', 'array'],
      delim,
      {
        ...env,
        [name]: ['altered', 'array'].join(delim)
      }
    ))

    it('which is path as string', () => unit(
      getFactory().path.set.string(
        ['altered', 'string'].join(delim)
      ),
      ['altered', 'string'],
      delim,
      {
        ...env,
        [name]: ['altered', 'string'].join(delim)
      }
    ))
  })

  describe('when adding new parts', () => {
    it('to its tails', () => unit(
      getFactory().path.append(['this', 'is', 'tail']),
      [...array, 'this', 'is', 'tail'],
      delim,
      {
        ...env,
        [name]: [...array, 'this', 'is', 'tail'].join(delim)
      }
    ))

    it('to its head', () => unit(
      getFactory().path.prepend(['this', 'is', 'head']),
      ['this', 'is', 'head', ...array],
      delim,
      {
        ...env,
        [name]: ['this', 'is', 'head', ...array].join(delim)
      }
    ))

    it('to both of its end', () => unit(
      getFactory().path.surround(['head', 'and', 'tail']),
      ['head', 'and', 'tail', ...array, 'head', 'and', 'tail'],
      delim,
      {
        ...env,
        [name]: ['head', 'and', 'tail', ...array, 'head', 'and', 'tail'].join(delim)
      }
    ))
  })
}


it('module matches snapshot', () => {
  expect(subject).toMatchSnapshot()
})

it('subject.base.delimiter() returns path.delimiter', () => {
  expect(subject.base.delimiter()).toBe(path.delimiter)
})

describe('subject.pathString being called', () => {
  const {PATH, ALT_NAMED_PATH} = env
  const newPath = ['hello', 'world', 'foo', 'bar']
  const newAltNamedPath = ['alternate', 'named', 'path']

  beforeEach(() => {
    Object.assign(env, {
      PATH: subject.base.join(newPath),
      ALT_NAMED_PATH: subject.base.join(newAltNamedPath)
    })
  })

  afterEach(() => {
    Object.assign(env, {PATH, ALT_NAMED_PATH})
  })

  describe('without specifying paramters', () => {
    testPathFactory(subject.pathString, newPath, path.delimiter)
  })

  describe('with specified `string`, without specifying `delim`', () => {
    testPathFactory(
      () => subject.pathString('specified:string:param'),
      ['specified', 'string', 'param'],
      path.delimiter
    )
  })

  describe('with specified `string` and `delim`', () => {
    testPathFactory(
      () => subject.pathString('specified:string:and:delimiter', ':'),
      ['specified', 'string', 'and', 'delimiter'],
      ':'
    )

    testPathFactory(
      () => subject.pathString('specified;string;and;delimiter', ';'),
      ['specified', 'string', 'and', 'delimiter'],
      ';'
    )
  })
})

describe('subject.pathEnv being called', () => {
  const oldEnv: Env = {...env}

  const newEnv: Env = {
    REST_FOO: 'foo',
    REST_BAR: 'bar',
    PATH: ['this', 'is', 'true', 'path'].join(path.delimiter),
    ALT_NAMED_PATH: ['this', 'is', 'alternative', 'named', 'path'].join(path.delimiter)
  }

  describe('without specified parameters', () => {
    function clearObject<X> (object: {[_: string]: X}) {
      for (const key in object) {
        delete object[key]
      }
    }

    beforeEach(() => {
      clearObject(env)
      Object.assign(env, newEnv)
    })

    afterEach(() => {
      clearObject(env)
      Object.assign(env, oldEnv)
    })

    testEnvFactory(
      () => subject.pathEnv(),
      newEnv,
      'PATH',
      path.delimiter
    )
  })

  describe('with specified `env`, without specifying `name` and `delim`', () => {
    testEnvFactory(
      () => subject.pathEnv({...newEnv}),
      {...newEnv},
      'PATH',
      path.delimiter
    )
  })

  describe('with specified `env` and `name`, without specifying `delim`', () => {
    testEnvFactory(
      () => subject.pathEnv({...newEnv}, 'PATH'),
      {...newEnv},
      'PATH',
      path.delimiter
    )

    testEnvFactory(
      () => subject.pathEnv({...newEnv}, 'ALT_NAMED_PATH'),
      {...newEnv},
      'ALT_NAMED_PATH',
      path.delimiter
    )
  })

  describe('with specified `env`, `name` and `delim`', () => {
    const name = 'SPECIAL_PATH'

    const env = {
      colon: {
        ...newEnv,
        [name]: ['abc', 'def', 'ghi'].join(':')
      },
      semicolon: {
        ...newEnv,
        [name]: ['abc', 'def', 'ghi'].join(';')
      }
    }

    testEnvFactory(
      () => subject.pathEnv({...env.colon}, name, ':'),
      {...env.colon},
      name,
      ':'
    )

    testEnvFactory(
      () => subject.pathEnv({...env.semicolon}, name, ';'),
      {...env.semicolon},
      name,
      ';'
    )
  })
})
