import process from 'process'
import { SpawnSyncRepresented } from '../../types'
import Representative from '../representative'

class SpawnSyncRepresentative<X extends SpawnSyncRepresented> extends Representative<X> {
  public readonly exit: SpawnSyncRepresentative.Exit<X>

  constructor (represented: X) {
    super(represented)

    const exit = Object.assign(
      (condition: SpawnSyncRepresentative.Exit.Condition<X> = () => true) => {
        if (condition(represented)) process.exit(this.represented.status)
      },
      {
        onerror: () => exit(() => Boolean(represented.status)),
        onsuccess: () => exit(() => !represented.status)
      }
    )

    this.exit = exit
  }
}

namespace SpawnSyncRepresentative {
  export interface Exit<Represented> {
    (condition?: Exit.Condition<Represented>): void
    onerror (): void
    onsuccess (): void
  }

  export namespace Exit {
    export type Condition<Represented> = (represented: Represented) => boolean
  }
}

export = SpawnSyncRepresentative
