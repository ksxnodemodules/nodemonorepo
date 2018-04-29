import * as assets from 'monorepo-shared-assets'
import {InvalidPackage} from '../../types'

export function group (list: InvalidPackage.List) {
  return assets.group.classify.dict.multiDistribute(
    list,
    item => item.reason.map(x => x.name)
  ).classified
}