import {IsomorphicSpawn, SpawnFactory} from '../../../types'

class SpawnError<
  Process extends IsomorphicSpawn.Return,
  TerminationInformation extends SpawnFactory.TerminationInformation<Process>
> extends Error {
  readonly info: TerminationInformation

  constructor (
    info: TerminationInformation,
    message: (info: TerminationInformation) => string = SpawnError.DEFAULT_MESSAGE
  ) {
    super(message(info))
    this.name = this.getName()
    this.info = info
  }

  getName () {
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

export = SpawnError
