import '../../../../.polyfill'

export type Iter<X> = AsyncIterable<X>

export async function getArray<X> (iterable: Iter<X>): Promise<ReadonlyArray<X>> {
  const result = Array<X>()

  for await (const item of iterable) {
    result.push(item)
  }

  return result
}

export default getArray
