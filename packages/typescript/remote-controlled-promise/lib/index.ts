export function create<Value> () {
  let resolve: Controller.Resolver<Value>
  let reject: Controller.Rejecter

  const controller = new Controller<Value>(
    x => resolve(x),
    x => reject(x)
  )

  const promise = new Promise<Value>((res, rej) => {
    resolve = res
    reject = rej
  })

  return new ControlledPromise(controller, promise)
}

export class ControlledPromise<Value> {
  readonly controller: Controller<Value>
  readonly promise: Promise<Value>

  constructor (
    controller: Controller<Value>,
    promise: Promise<Value>
  ) {
    this.controller = controller
    this.promise = promise
  }

  resolve (value: Value) {
    this.controller.resolve(value)
    return this.promise
  }

  reject (reason?: any) {
    this.controller.reject(reason)
    return this.promise
  }
}

export class Controller<Value> {
  readonly resolve: Controller.Resolver<Value>
  readonly reject: Controller.Rejecter

  constructor (
    resolve: Controller.Resolver<Value>,
    reject: Controller.Rejecter
  ) {
    this.resolve = resolve
    this.reject = reject
  }
}

export namespace Controller {
  export type Resolver<X> = (x: Promise<X> | X) => void
  export type Rejecter = (x?: any) => void
}

export default create
