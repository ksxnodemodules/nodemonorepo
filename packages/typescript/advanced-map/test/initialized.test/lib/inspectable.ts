import {
  Initialized,
  MapLike
} from '../../../index'

export = class <
  Key,
  Value,
  Data extends MapLike<Key, Value> = Map<Key, Value>
> extends Initialized<Key, Value, Data> {
  public get __data (): Data {
    return this.data
  }
}
