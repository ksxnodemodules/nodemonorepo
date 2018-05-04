import * as assets from 'monorepo-shared-assets'
import urge = assets.iter.fns.urge

export async function * restrictedConcurrentActions<Y> (
  actions: restrictedConcurrentActions.ActionList<Y>,
  partLength: restrictedConcurrentActions.PartLength,
  handleRemain?: restrictedConcurrentActions.RemainingHandler<Y>
): restrictedConcurrentActions.ReturningPromise<Y> {
  for (const segment of urge(actions, partLength, handleRemain)) {
    yield await Promise.all(segment.map(fn => fn()))
  }
}

export namespace restrictedConcurrentActions {
  export type Action<Y> = () => Promise<Y>
  export type ActionList<Y> = Iterable<Action<Y>>
  export type PartLength = number
  export type RemainingHandler<Y> = urge.RemainingHandler<Action<Y>>
  export type ReturningValue<Y> = ReadonlyArray<Y>
  export type ReturningPromise<Y> = AsyncIterableIterator<ReturningValue<Y>>

  export async function asArray<Y> (
    actions: ActionList<Y>,
    partLength: PartLength,
    handleRemain?: RemainingHandler<Y>
  ): asArray.ReturningPromise<Y> {
    let array = Array<ReadonlyArray<Y>>()

    for await (const part of restrictedConcurrentActions(actions, partLength, handleRemain)) {
      array.push(part)
    }

    return array
  }

  export namespace asArray {
    export type ReturningValue<Y> = ReadonlyArray<restrictedConcurrentActions.ReturningValue<Y>>
    export type ReturningPromise<Y> = Promise<ReturningValue<Y>>
  }
}

export default restrictedConcurrentActions
