import createSetupTeardown from '../../.lib/setup-teardown'
import partition from '../../../lib/publishables'

import {
  PublishablePackageList,
  UnpublisablePackageList,
  PrivatePackageList,
  PublishableClassification
} from '../../../lib/types'

type PackageList = PublishablePackageList | UnpublisablePackageList | PrivatePackageList

const {apply} = createSetupTeardown('publishability.yaml')

it('matches snapshot', apply(async () => {
  const classified = await partition('root')
  expect(classified).toMatchSnapshot()
}))
