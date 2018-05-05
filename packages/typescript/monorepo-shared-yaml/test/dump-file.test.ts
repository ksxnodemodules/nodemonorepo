import createVirtualEnvironment from './.lib/virtual-env'
import subject from '../index'

const {apply} = createVirtualEnvironment('dump.yaml')

it('works', apply(async () => {
  const data = {abc: 123, def: 456}
  await subject.dumpFile(data, 'root/target.yaml')
  expect(await subject.loadFile('root/target.yaml')).toEqual(data)
}))
