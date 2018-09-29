import { wrapException } from '../../../../index'
import wrap = wrapException.wrapPromiseRejection

namespace resolved {
  export function synchronous (value: number) {
    return new Result({ value })
  }

  export function asynchronous (value: number) {
    return Promise.resolve(new Result({ value }))
  }
}

namespace rejected {
  export function synchronous () {
    throw new Error('This is a rejection reason')
  }

  export function asynchronous () {
    return Promise.reject(new Error('This is a rejection reason'))
  }
}

namespace handleRejection {
  export function synchronous (reason: any, param: number) {
    return new Result({ reason, param })
  }

  export function asynchronous (reason: any, param: number) {
    return Promise.resolve(new Result({ reason, param }))
  }
}

class Result {
  constructor (dict: object) {
    Object.assign(this, dict)
  }
}

describe('with synchronous main', () => {
  describe('without rejection handler', () => {
    it('when promise resolves', async () => {
      const fn = wrap(resolved.synchronous)
      expect(await fn(1234)).toMatchSnapshot()
    })

    it('when promise rejects', async () => {
      const fn = wrap(rejected.synchronous)
      await expect(fn(1234)).rejects.toMatchSnapshot()
    })
  })

  describe('with synchronous rejection handler', () => {
    it('when promise resolves', async () => {
      const fn = wrap(resolved.synchronous, handleRejection.synchronous)
      expect(await fn(1234)).toMatchSnapshot()
    })

    it('when promise rejects', async () => {
      const fn = wrap(rejected.synchronous, handleRejection.synchronous)
      expect(await fn(1234)).toMatchSnapshot()
    })
  })

  describe('with asynchronous rejection handler', () => {
    it('when promise resolves', async () => {
      const fn = wrap(resolved.synchronous, handleRejection.asynchronous)
      expect(await fn(1234)).toMatchSnapshot()
    })

    it('when promise rejects', async () => {
      const fn = wrap(rejected.synchronous, handleRejection.asynchronous)
      expect(await fn(1234)).toMatchSnapshot()
    })
  })
})

describe('with asynchronous main', () => {
  describe('without rejection handler', () => {
    it('when promise resolves', async () => {
      const fn = wrap(resolved.asynchronous)
      expect(await fn(1234)).toMatchSnapshot()
    })

    it('when promise rejects', async () => {
      const fn = wrap(rejected.asynchronous)
      await expect(fn(1234)).rejects.toMatchSnapshot()
    })
  })

  describe('with synchronous rejection handler', () => {
    it('when promise resolves', async () => {
      const fn = wrap(resolved.asynchronous, handleRejection.synchronous)
      expect(await fn(1234)).toMatchSnapshot()
    })

    it('when promise rejects', async () => {
      const fn = wrap(rejected.asynchronous, handleRejection.synchronous)
      expect(await fn(1234)).toMatchSnapshot()
    })
  })

  describe('with asynchronous rejection handler', () => {
    it('when promise resolves', async () => {
      const fn = wrap(resolved.asynchronous, handleRejection.asynchronous)
      expect(await fn(1234)).toMatchSnapshot()
    })

    it('when promise rejects', async () => {
      const fn = wrap(rejected.asynchronous, handleRejection.asynchronous)
      expect(await fn(1234)).toMatchSnapshot()
    })
  })
})
