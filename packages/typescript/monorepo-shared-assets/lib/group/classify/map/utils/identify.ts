import immutable from 'immutable'

export function identify<X, ID> (
  id: ID,
  map: Map<ID, X>,
  identifier: identify.Identifier<ID> = identify.DEFAULT_IDENTIFIER
): ID | void {
  return immutable
    .List(map.keys())
    .find(idx => identifier(id, idx))
}

export namespace identify {
  export const DEFAULT_IDENTIFIER = Object.is
  export type Identifier<ID> = (a: ID, b: ID) => boolean
}

export default identify
