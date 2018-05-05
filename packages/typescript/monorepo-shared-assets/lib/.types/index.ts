export namespace Dict {
  export type StringKeyed<Value> = {
    [key: string]: Value | void
  }

  export type NumberKeyed<Value> = {
    [key: number]: Value | void
  }

  export type StrKey<X> = StringKeyed<X>
  export type NumKey<X> = NumberKeyed<X>
}
