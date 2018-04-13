import getMismatchedDependencies, {Checker} from '../../lib/mismatches'

const {
  ANY,
  EQUAL,
  TILDA_EQUAL,
  CARET_EQUAL,
  EQUAL_MIN,
  CARET_MIN,
  TILDA_MIN,
  EQUAL_OR_ANY,
  TILDA_EQUAL_OR_ANY,
  CARET_EQUAL_OR_ANY,
  EQUAL_MIN_OR_ANY,
  TILDA_MIN_OR_ANY,
  CARET_MIN_OR_ANY,
  ANY_OR_EQUAL,
  ANY_OR_TILDA_EQUAL,
  ANY_OR_CARET_EQUAL,
  ANY_OR_EQUAL_MIN,
  ANY_OR_CARET_MIN,
  ANY_OR_TILDA_MIN
} = getMismatchedDependencies

const prvAllCheckers = {
  ANY,
  EQUAL,
  TILDA_EQUAL,
  CARET_EQUAL,
  EQUAL_MIN,
  CARET_MIN,
  TILDA_MIN,
  EQUAL_OR_ANY,
  TILDA_EQUAL_OR_ANY,
  CARET_EQUAL_OR_ANY,
  EQUAL_MIN_OR_ANY,
  TILDA_MIN_OR_ANY,
  CARET_MIN_OR_ANY,
  ANY_OR_EQUAL,
  ANY_OR_TILDA_EQUAL,
  ANY_OR_CARET_EQUAL,
  ANY_OR_EQUAL_MIN,
  ANY_OR_CARET_MIN,
  ANY_OR_TILDA_MIN
}

export type CheckerCollection = {[name: string]: Checker}
export type PrvAllCheckerCollection = typeof prvAllCheckers
export type AllCheckerCollection = CheckerCollection & PrvAllCheckerCollection
export const allCheckers = prvAllCheckers as AllCheckerCollection
export default allCheckers
