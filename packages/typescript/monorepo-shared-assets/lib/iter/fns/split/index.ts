export function split<X> (
  iterable: Iterable<X>,
  choose: split.LineChooser<X>
): split.Result<X> {
  const first = Array<X>()
  const second = Array<X>()
  let line: X | undefined = undefined
  let foundLine = false

  let addElement = (item: X) => {
    if (choose(item)) {
      addElement = x => second.push(x)
      line = item
      foundLine = true
    } else {
      first.push(item)
    }
  }

  for (const item of iterable) {
    addElement(item)
  }

  return {
    first,
    second,
    line,
    foundLine
  }
}

export namespace split {
  export type LineChooser<X> = (x: X) => boolean

  export interface Result<X> extends Halves<X> {
    readonly line?: X
    readonly foundLine: boolean
  }

  export interface Halves<X> {
    readonly first: ReadonlyArray<X>
    readonly second: ReadonlyArray<X>
  }
}

export default split
