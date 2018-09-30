import process from 'process'
import { SpawnSyncRepresented } from '../../types'
import Representative from '../representative'

class SpawnSyncRepresentative<X extends SpawnSyncRepresented> extends Representative<X> {
  exit () {
    process.exit(this.represented.status)
  }
}

export = SpawnSyncRepresentative
