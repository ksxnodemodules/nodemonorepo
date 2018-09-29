if (!global.Symbol) {
  class Symbol {
    readonly toString: () => string

    constructor (description?: string) {
      const random = Array(256).map(() => Math.random().toString(36).slice(2)).join('')
      const str = JSON.stringify({ description, random })
      this.toString = () => str
    }
  }

  Object.assign(global, {
    Symbol: (name?: string) => new Symbol(name)
  })
}

for (const name of ['iterator', 'asyncIterator']) {
  if (name in Symbol) continue
  Object.assign(Symbol, { [name]: Symbol(name) })
}
