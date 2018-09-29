import getMismatchedDependencies, { Checker } from '../../lib/mismatches'
const { allCheckers } = getMismatchedDependencies

export { CheckerCollection } from '../../lib/mismatches'
export type AllCheckerCollection = getMismatchedDependencies.AllCheckerCollection

export function iterate (fn: (check: Checker, name: string) => void) {
  Object
    .entries(allCheckers)
    .forEach(([name, check]) => fn(check, name))
}

export default iterate
