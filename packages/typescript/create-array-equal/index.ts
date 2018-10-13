import { zip } from 'iter-tools'
import { ElementOf } from 'typescript-miscellaneous'

function create<Array extends any[]> (
  elementEqual: create.ElementEqual<Array> = create.ElementEqual.DEFAULT
): create.ArrayEqual<Array> {
  type ArrayEqual = create.ArrayEqual<Array>

  const arrayEqual: ArrayEqual = (al, bl) => {
    if (al.length !== bl.length) return false

    for (const [ax, bx] of zip(al, bl)) {
      if (!elementEqual(ax, bx, arrayEqual)) return false
    }

    return true
  }

  return arrayEqual
}

namespace create {
  export interface ArrayEqual<Array extends any[]> {
    (a: Array, b: Array): boolean
  }

  export interface ElementEqual<Array extends any[]> {
    (a: ElementOf<Array>, b: ElementOf<Array>, fn: ArrayEqual<Array>): boolean
  }

  export namespace ElementEqual {
    export const DEFAULT = (a: any, b: any) => Object.is(a, b)
  }
}

export = create
