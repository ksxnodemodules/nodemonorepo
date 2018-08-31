import path from 'path'
import {TargetSpecifier, Param} from '../../types'
import TARGETED_EXTENSIONS from '../targeted-extensions'

export const DEFAULT_TARGET_SPECIFIER: TargetSpecifier = specifyTarget
export default DEFAULT_TARGET_SPECIFIER

function specifyTarget ({item, container}: Param) {
  const {name} = path.parse(item)
  return TARGETED_EXTENSIONS.map(suffix => path.join(container, name + suffix))
}
