import {IsomorphicSpawn, InternalErrorInformation} from '../../../types'
import SpawnError from '../spawn-error'

class InternalError<Process extends IsomorphicSpawn.Return, Error> extends SpawnError {
  readonly info: InternalErrorInformation<Process, Error>

  constructor (info: InternalErrorInformation<Process, Error>) {
    super(String(info.error))
    this.info = info
  }

  protected getName () {
    return 'InternalError'
  }
}

export = InternalError
