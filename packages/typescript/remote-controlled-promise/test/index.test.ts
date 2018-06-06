import create, {ControlledPromise, Controller} from '../index'

describe('returns correct types', () => {
  const sample = create()

  it('sample is an instance of ControlledPromise', () => {
    expect(sample).toBeInstanceOf(ControlledPromise)
  })

  it('sample.controller is an instance of Controller', () => {
    expect(sample.controller).toBeInstanceOf(Controller)
  })

  it('sample.promise is an instance of Promise', () => {
    expect(sample.promise).toBeInstanceOf(Promise)
  })
})

describe('resolves', () => {
  const value = 'Resolved Value'
  const sample = create<typeof value>()
  const result = sample.resolve(value)

  it('sample.promise resolves', async () => {
    expect(await sample.promise).toBe(value)
  })

  it('sample.resolve() resolves', async () => {
    expect(await result).toBe(value)
  })
})

describe('rejects', () => {
  const reason = 'Rejected Reason'
  const sample = create<never, typeof reason>()
  const result = sample.reject(reason)

  it('sample.promise rejects', () => {
    return expect(sample.promise).rejects.toBe(reason)
  })

  it('sample.reject() rejects', async () => {
    return expect(result).rejects.toBe(reason)
  })
})
