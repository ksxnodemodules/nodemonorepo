import { DeepFunc } from '../../types'
import IGNORED_NAMES from '../ignored-names'
const DEFAULT_DEEP_FUNC: DeepFunc = x => !IGNORED_NAMES.includes(x.item)
export = DEFAULT_DEEP_FUNC
