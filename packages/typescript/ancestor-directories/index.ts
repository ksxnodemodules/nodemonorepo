import { dirname } from 'path'
import { iter } from 'monorepo-shared-assets'
import untilUnchange = iter.fns.untilUnchange
export const allAncestorDirectories = (path: string) => untilUnchange(path, x => dirname(x))
export default allAncestorDirectories
