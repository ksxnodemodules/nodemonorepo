import createSetupTeardown from '../../.lib/setup-teardown'
import { listOutdatedDependencies } from '../../../index'

const { apply } = createSetupTeardown('outdated.yaml')

it('without options', apply(async () => {
  const outdated = await listOutdatedDependencies('root')
  expect(outdated).toMatchSnapshot()
}))

describe('with options', () => {
  it('with beOnInstalled=true', apply(async () => {
    const outdated = await listOutdatedDependencies('root', { baseOnInstalled: true })
    expect(outdated).toMatchSnapshot()
  }))

  it('with custom generateVersionRequirement', apply(async () => {
    const outdated = await listOutdatedDependencies('root', {
      generateVersionRequirement: x => x
    })

    expect(outdated).toMatchSnapshot()
  }))

  it('with custom transformVersionRequirement', apply(async () => {
    const outdated = await listOutdatedDependencies('root', {
      transformVersionRequirement: x => x
    })

    expect(outdated).toMatchSnapshot()
  }))

  it('with all custom options', apply(async () => {
    const outdated = await listOutdatedDependencies('root', {
      baseOnInstalled: true,
      generateVersionRequirement: x => x,
      transformVersionRequirement: x => x
    })

    expect(outdated).toMatchSnapshot()
  }))
})
