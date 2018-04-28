export namespace Dict {
  export type StringKeyed<Value> = {
    [key: string]: Value
  }

  export type NumberKeyed<Value> = {
    [key: number]: Value
  }

  export type StrKey<X> = StringKeyed<X>
  export type NumKey<X> = NumberKeyed<X>
}
