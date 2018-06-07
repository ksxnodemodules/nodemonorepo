import {listManifestFiles} from '../../index'
import createVirtualEnvironment from '../.lib/virtual-env'
import {chooseTypeScript, ignoreCustomDeepFunc} from '../.lib/utils'

describe('without javascript files', () => {
  const {apply} = createVirtualEnvironment()

  it('without options', apply(async () => {
    const sample = await getSample('root')
    expect(sample).toMatchSnapshot()
  }))

  it('with custom chooser', apply(async () => {
    const sample = await getSample('root', {
      choose: chooseTypeScript
    })

    expect(sample).toMatchSnapshot()
  }))

  it('with custom deep function', apply(async () => {
    const sample = await getSample('root', {
      deep: ignoreCustomDeepFunc
    })

    expect(sample).toMatchSnapshot()
  }))

  it('with custom chooser and deep function', apply(async () => {
    const sample = await getSample('root', {
      choose: chooseTypeScript,
      deep: ignoreCustomDeepFunc
    })

    expect(sample).toMatchSnapshot()
  }))
})

describe('with javascript files', () => {
  const {apply} = createVirtualEnvironment(true)

  it('without options', apply(async () => {
    const sample = await getSample('root')
    expect(sample).toMatchSnapshot()
  }))

  it('with custom chooser', apply(async () => {
    const sample = await getSample('root', {
      choose: chooseTypeScript
    })

    expect(sample).toMatchSnapshot()
  }))

  it('with custom deep function', apply(async () => {
    const sample = await getSample('root', {
      deep: ignoreCustomDeepFunc
    })

    expect(sample).toMatchSnapshot()
  }))

  it('with custom chooser and deep function', apply(async () => {
    const sample = await getSample('root', {
      choose: chooseTypeScript,
      deep: ignoreCustomDeepFunc
    })

    expect(sample).toMatchSnapshot()
  }))
})

async function getSample (dirname: string, options?: listManifestFiles.Options) {
  const sample = await listManifestFiles(dirname, options)
  return sample.map(({path, type}) => ({path, type}))
}
