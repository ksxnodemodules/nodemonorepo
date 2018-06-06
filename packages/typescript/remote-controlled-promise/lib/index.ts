export function create<Value, Reason = Error> () {
  let resolve: Controller.Resolver<Value>
  let reject: Controller.Rejecter<Reason>

  const controller = new Controller<Value, Reason>(
    x => resolve(x),
    x => reject(x)
  )

  const promise = new Promise<Value>((res, rej) => {
    resolve = res
    reject = rej
  })

  return new ControlledPromise(controller, promise)
}

export class ControlledPromise<Value, Reason> {
  readonly controller: Controller<Value, Reason>
  readonly promise: Promise<Value>

  constructor (
    controller: Controller<Value, Reason>,
    promise: Promise<Value>
  ) {
    this.controller = controller
    this.promise = promise
  }

  resolve (value: Value) {
    this.controller.resolve(value)
    return this.promise
  }

  reject (reason: Reason) {
    this.controller.reject(reason)
    return this.promise
  }
}

export class Controller<Value, Reason> {
  readonly resolve: Controller.Resolver<Value>
  readonly reject: Controller.Rejecter<Reason>

  constructor (
    resolve: Controller.Resolver<Value>,
    reject: Controller.Rejecter<Reason>
  ) {
    this.resolve = resolve
    this.reject = reject
  }
}

export namespace Controller {
  export type Resolver<X> = (x: Promise<X> | X) => void
  export type Rejecter<X> = (x: X) => void
}

export default create
