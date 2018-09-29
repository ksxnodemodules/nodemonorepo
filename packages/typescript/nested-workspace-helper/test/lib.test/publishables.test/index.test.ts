import createSetupTeardown from '../../.lib/setup-teardown'
import { classifyPublishability } from '../../../index'

const { apply } = createSetupTeardown('publishability.yaml')

describe('matches snapshot', () => {
  it('when there are all 3 types', apply(async () => {
    const classified = await classifyPublishability('root')
    expect(classified).toMatchSnapshot()
  }))

  it('when there is only publishable packages', apply(async () => {
    const classified = await classifyPublishability('root/toBePublishable')
    expect(classified).toMatchSnapshot()
  }))

  it('when there is only unpublishable packages', apply(async () => {
    const classified = await classifyPublishability('root/toBeUnpublishable')
    expect(classified).toMatchSnapshot()
  }))

  it('when there is only skipped packages', apply(async () => {
    const classified = await classifyPublishability('root/toBeSkipped')
    expect(classified).toMatchSnapshot()
  }))
})
