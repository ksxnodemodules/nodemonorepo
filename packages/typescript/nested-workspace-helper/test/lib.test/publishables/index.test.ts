import createSetupTeardown from '../../.lib/setup-teardown'
import {classifyPublishability} from '../../../index'

import {
  PublishablePackageList,
  UnpublisablePackageList,
  PrivatePackageList,
  PublishableClassification
} from '../../../lib/types'

type PackageList = PublishablePackageList | UnpublisablePackageList | PrivatePackageList

const {apply} = createSetupTeardown('publishability.yaml')

it('matches snapshot', apply(async () => {
  const classified = await classifyPublishability('root')
  expect(classified).toMatchSnapshot()
}))
