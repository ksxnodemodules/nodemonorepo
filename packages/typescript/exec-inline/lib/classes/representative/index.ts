abstract class Representative<Represented> {
  protected readonly represented: Represented

  constructor (represented: Represented) {
    this.represented = represented
  }
}

export = Representative
