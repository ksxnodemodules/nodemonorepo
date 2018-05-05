import createVirtualEnvironment from './.lib/virtual-env'
import subject from '../index'

const {apply} = createVirtualEnvironment('load.yaml')

it('matches snapshot', apply(async () => {
  expect(subject.loadFileSync('root/source.yaml')).toMatchSnapshot()
}))

it('throws error matching snapshot', apply(async () => {
  expect(() => subject.loadFileSync('root/not-yaml')).toThrowErrorMatchingSnapshot()
}))
