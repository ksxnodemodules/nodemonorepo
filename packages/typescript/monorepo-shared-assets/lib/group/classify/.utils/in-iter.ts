export function isInIter<Element> (
  item: Element,
  iter: Iterable<Element>,
  compare: isInIter.Comparator<Element> = isInIter.DEFAULT_COMPARATOR
): boolean {
  for (const element of iter) {
    if (compare(item, element)) {
      return true
    }
  }

  return false
}

export namespace isInIter {
  export const DEFAULT_COMPARATOR = Object.is
  export type Comparator<X> = (a: X, b: X) => boolean
}

export default isInIter
