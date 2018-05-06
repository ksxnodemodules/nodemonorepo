import isInIter from '../.utils/in-iter'
import identify from './utils/identify'

export namespace classify {
  export function singleDistribute<X, ID> (
    values: Iterable<X>,
    classifier: singleDistribute.Classifier<X, ID>,
    identifier?: singleDistribute.Identifier<ID>,
    duplicateChecker?: isInIter.Comparator<X>
  ): singleDistribute.Classification<X, ID> {
    const db = new Map<ID, Set<X>>()

    for (const item of values) {
      const id = classifier(item)
      const foundID = identify(id, db, identifier)

      if (foundID) {
        const set = db.get(foundID) as Set<X>
        isInIter(item, set, duplicateChecker) || set.add(item)
      } else {
        db.set(id, new Set([item]))
      }
    }

    return db
  }

  export namespace singleDistribute {
    export type Classification<X, ID> = ReadonlyMap<ID, Classification.Classified<X>>

    export namespace Classification {
      export type Classified<X> = ReadonlySet<X>
    }

    export type Classifier<X, ID> = (x: X) => ID
    export type Identifier<ID> = identify.Identifier<ID>
  }

  export function multiDistribute<X, ID> (
    values: Iterable<X>,
    classifier: multiDistribute.Classifier<X, ID>,
    identifier?: multiDistribute.Identifier<ID>,
    duplicateChecker?: isInIter.Comparator<X>
  ): multiDistribute.MultipleDistribution<X, ID> {
    const classified = new Map<ID, Set<X>>()
    const unclassified = new Set<X>()

    for (const item of values) {
      const classes = new Set(classifier(item))

      if (classes.size) {
        for (const id of classes) {
          const foundID = identify(id, classified, identifier)

          if (foundID) {
            const set = classified.get(foundID) as Set<X>
            isInIter(item, set, duplicateChecker) || set.add(item)
          } else {
            classified.set(id, new Set([item]))
          }
        }
      } else {
        unclassified.add(item)
      }
    }

    return {classified, unclassified}
  }

  export namespace multiDistribute {
    export interface MultipleDistribution<X, ID> {
      readonly classified: MultipleDistribution.Classified<X, ID>
      readonly unclassified: MultipleDistribution.Unclassified<X>
    }

    export namespace MultipleDistribution {
      export type Classified<X, ID> = ReadonlyMap<ID, Distribution<X>>
      export type Unclassified<X> = ReadonlySet<X>
      export type Distribution<X> = ReadonlySet<X>
    }

    export type Classifier<X, ID> = (x: X) => Iterable<ID>
    export type Identifier<ID> = identify.Identifier<ID>
  }
}

export default classify
