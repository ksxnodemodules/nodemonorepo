import {listAllPackages} from '../../../index'
import * as converters from '../../../lib/converters'
import createSetupTeardown from '../../.lib/setup-teardown'

const {apply} = createSetupTeardown('valid.yaml')
const getPromise = () => listAllPackages('root')

describe('listAllPackages function', () => {
  it('matches snapshot', apply(async () => {
    expect(await getPromise()).toMatchSnapshot()
  }))
})

describe('coverter function', () => {
  it('convert list to string', apply(async () => {
    expect(converters.pkgList.list.asString(await getPromise())).toMatchSnapshot()
  }))

  it('convert list to arrays', apply(async () => {
    expect(converters.pkgList.list.asStringArray(await getPromise())).toMatchSnapshot()
  }))
})
