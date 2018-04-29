import createSetupTeardown from '../../.lib/setup-teardown'
import {listAllPackages} from '../../../index'
import {listAllInvalidPackages} from '../../../index'

const {apply} = createSetupTeardown('invalids.yaml')
const getInvalids = () => listAllInvalidPackages('root')

it('matches snapshot', apply(async () => {
  expect(await getInvalids()).toMatchSnapshot()
}))

it('contains no valid packages', apply(async () => {
  const result = await getInvalids()
  const failure = result.filter(x => x.manifestContent.__expect === 'Valid')
  expect(failure).toEqual([])
}))

it('contains only invalid packages', apply(async () => {
  const result = await getInvalids()
  const failure = result.filter(x => x.manifestContent.__expect !== 'Invalid')
  expect(failure).toEqual([])
}))

it('leaves only valid packages', apply(async () => {
  const result = await getValids()
  const failure = result.filter(x => x.manifestContent.__expect !== 'Valid')
  expect(failure).toEqual([])
}))

it('leaves no invalid packages', apply(async () => {
  const result = await getValids()
  const failure = result.filter(x => x.manifestContent.__expect === 'Invalid')
  expect(failure).toEqual([])
}))

it('no reason object shall have its name different than its class', apply(async () => {
  const invalids = await getInvalids()

  const comparisions = invalids.map(x => ({
    package: {
      path: x.path,
      name: x.manifestContent.name
    },
    reason: x.reason.map(x => ({
      name: {
        instance: x.name,
        constructor: x.constructor.name
      },
      compare: x.name === x.constructor.name
    }))
  }))

  expect(comparisions).toMatchSnapshot()

  comparisions.forEach(
    x => x.reason.forEach(
      xx => expect(xx.compare).toBe(true)
    )
  )
}))

async function getValids () {
  const list = await listAllPackages('root')
  const invalids = await listAllInvalidPackages('root')
  const invalidPaths = invalids.map(x => x.path)
  const valids = list.filter(x => !invalidPaths.includes(x.path))
  return valids
}
