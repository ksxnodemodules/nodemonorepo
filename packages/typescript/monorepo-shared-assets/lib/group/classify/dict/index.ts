import * as types from '../../../.types'
import isInIter from '../.utils/in-iter'

export namespace classify {
  export function singleDistribute<X> (
    values: Iterable<X>,
    classifier: singleDistribute.Classifier<X>,
    duplicationChecker?: isInIter.Comparator<X>
  ): singleDistribute.Classification<X> {
    const db: types.Dict.StrKey<X[]> = {}

    for (const item of values) {
      const name = classifier(item)

      if (name in db) {
        const set = db[name]
        isInIter(item, set, duplicationChecker) || set.push(item)
      } else {
        db[name] = [item]
      }
    }

    return db
  }

  export namespace singleDistribute {
    export type Classification<X> = Readonly<Dict<Classification.Array<X>>>

    export namespace Classification {
      export type Array<X> = ReadonlyArray<X>
    }

    export type Classifier<X> = (x: X) => string
  }

  export function multiDistribute<X> (
    values: Iterable<X>,
    classifier: multiDistribute.Classifier<X>,
    duplicationChecker?: isInIter.Comparator<X>
  ): multiDistribute.MultipleDistribution<X> {
    const classified: types.Dict.StrKey<X[]> = {}
    const unclassified: X[] = []

    for (const item of values) {
      const classes = classifier(item)

      if (classes.length) {
        for (const name of classes) {
          if (name in classified) {
            const array = classified[name]
            isInIter(item, array, duplicationChecker) || classified[name].push(item)
          } else {
            classified[name] = [item]
          }
        }
      } else {
        unclassified.push(item)
      }
    }

    return {classified, unclassified}
  }

  export namespace multiDistribute {
    export interface MultipleDistribution<X> {
      readonly classified: MultipleDistribution.Classified<X>
      readonly unclassified: MultipleDistribution.Unclassified<X>
    }

    export namespace MultipleDistribution {
      export type Classified<X> = Readonly<Dict<Distribution<X>>>
      export type Unclassified<X> = ReadonlyArray<X>
      export type Distribution<X> = ReadonlyArray<X>
    }

    export type Classifier<X> = (x: X) => ReadonlyArray<string>
  }

  export type Dict<X> = Readonly<types.Dict.StrKey<X>>
}

export default classify
