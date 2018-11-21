import { zip } from 'iter-tools'
import { ElementOf } from 'typescript-miscellaneous'

/**
 * @private
 */
interface ArrayLike<Element = any> extends Iterable<Element> {
  readonly [index: number]: Element
  readonly length: number
}

function create<Array extends ArrayLike> (
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
  export interface ArrayEqual<Array extends ArrayLike> {
    (a: Array, b: Array): boolean
  }

  export interface ElementEqual<Array extends ArrayLike> {
    (a: ElementOf<Array>, b: ElementOf<Array>, fn: ArrayEqual<Array>): boolean
  }

  export namespace ElementEqual {
    export const DEFAULT = (a: any, b: any) => Object.is(a, b)
  }
}

export = create
