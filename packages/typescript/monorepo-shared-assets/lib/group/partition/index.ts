import ramda from 'ramda'
import immutable from 'immutable'
import * as types from '../../.types'

export function partition<X> (
  iterable: Iterable<X>,
  classifiers: partition.Classifier.Iter<X>
): partition.Partition<X> {
  return partition.fromClassifierList(new Set(iterable), new Set(classifiers))
}

export namespace partition {
  export function fromClassifierList<X> (
    values: Iterable<X>,
    classifiers: Classifier.Iter<X>
  ): Partition<X> {
    return fromClassifierList.iterable(values, classifiers)
  }

  export namespace fromClassifierList {
    export function iterable<X> (
      values: Iterable<X>,
      classifiers: Classifier.Iter<X>
    ): Partition<X> {
      const result = array(Array.from(values), Array.from(classifiers))

      const classified = immutable
        .Map(result.classified)
        .map(x => new Set(x as ReadonlyArray<X>))
        .toObject()

      const untouched = new Set(result.untouched)

      return { classified, untouched }
    }

    export function array<X> (
      list: ReadonlyArray<X>,
      classifiers: Classifier.List<X>
    ): Partition.Array<X> {
      if (!classifiers.length) return { classified: {}, untouched: list }
      const [[target, func], ...nextClassifiers] = classifiers
      const [value, nextList] = ramda.partition(func, Array.from(list))
      const nextPartition = array(nextList, nextClassifiers)
      const classified = { [target]: value, ...nextPartition.classified }
      const untouched = nextPartition.untouched
      return { classified, untouched }
    }
  }

  export function fromClassifierDict<X> (
    list: Iterable<X>,
    classifiers: Classifier.Dict<X>
  ): Partition<X> {
    return partition(
      list,
      Object.entries(classifiers as {[_: string]: Classifier.Func<X>})
    )
  }

  export type Partition<X> = Partition.Set<X>

  export namespace Partition {
    export interface Set<X> {
      readonly classified: Dict<ReadonlySet<X>>
      readonly untouched: ReadonlySet<X>
    }

    export interface Array<X> {
      readonly classified: Dict<ReadonlyArray<X>>
      readonly untouched: ReadonlyArray<X>
    }
  }

  export type Classifier<X> = [
    Classifier.Target,
    Classifier.Func<X>
  ]

  export namespace Classifier {
    export type Iter<X> = Iterable<Classifier<X>>
    export type Set<X> = ReadonlySet<Classifier<X>>
    export type List<X> = ReadonlyArray<Classifier<X>>
    export type Dict<X> = partition.Dict<Func<X>>
    export type Target = string
    export type Func<X> = (x: X) => boolean
  }

  export type Dict<X> = Readonly<types.Dict.StrKey<X>>
}

export default partition
