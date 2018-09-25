class SpawnError extends Error {
  constructor (message: string) {
    super(message)
    this.name = this.getName()
  }

  protected getName () {
    return 'SpawnError'
  }
}

export = SpawnError
