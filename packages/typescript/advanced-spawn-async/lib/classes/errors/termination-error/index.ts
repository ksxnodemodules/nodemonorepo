import {IsomorphicSpawn, SpawnFactory} from '../../../types'
import SpawnError from '../spawn-error'

class TerminationError<
  Process extends IsomorphicSpawn.Return,
  TerminationInformation extends SpawnFactory.TerminationInformation<Process>
> extends SpawnError {
  readonly info: TerminationInformation

  constructor (
    info: TerminationInformation,
    message: (info: TerminationInformation) => string = TerminationError.DEFAULT_MESSAGE
  ) {
    super(message(info))
    this.name = this.getName()
    this.info = info
  }

  protected getName () {
    return 'SpawnError'
  }

  static DEFAULT_MESSAGE (info: SpawnFactory.TerminationInformation<IsomorphicSpawn.Return>) {
    const {
      command,
      args,
      stderr,
      status,
      signal
    } = info

    const cli = JSON.stringify([command, ...args])
    const code = JSON.stringify({status, signal})

    return `Failed to execute ${cli} (${code}) ${stderr}`
  }
}

export = TerminationError
