import createVirtualEnvironment from './.lib/virtual-env'
import subject from '../index'

const { apply } = createVirtualEnvironment('load.yaml')

it('matches snapshot', apply(async () => {
  expect(await subject.loadFile('root/source.yaml')).toMatchSnapshot()
}))

it('throws error matching snapshot', apply(async () => {
  // tslint:disable-next-line:no-floating-promises
  expect(subject.loadFile('root/not-yaml')).rejects.toMatchSnapshot()
}))
