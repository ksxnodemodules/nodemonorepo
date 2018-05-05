import createVirtualEnvironment from './.lib/virtual-env'
import subject from '../index'

const {apply} = createVirtualEnvironment('dump.yaml')

it('works', apply(async () => {
  const data = {abc: 123, def: 456}
  subject.dumpFileSync(data, 'root/target.yaml')
  expect(subject.loadFileSync('root/target.yaml')).toEqual(data)
}))
