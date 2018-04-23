import * as fsTreeUtils from 'fs-tree-utils'
import * as xjest from 'extra-jest'
import virtualEnvironment from '../.lib/virtual-env'
import * as subject from '../../index'

const {apply} = virtualEnvironment
const snap = (x: any) => xjest.snap.safe(x)()

it('add', () => {
  expect(subject.add(
    ['middleA', 'removeA', 'middleB', 'removeB'],
    {
      prepend: ['headA', 'headB'],
      append: ['tailA', 'tailB'],
      remove: ['removeA', 'removeB']
    }
  )).toMatchSnapshot()
})

it('getDeltaFiles', apply(async () => {
  expect(await subject.getDeltaFiles('root', '.myignore.yaml')).toMatchSnapshot()
}))

it('readDeltaFiles', apply(async () => {
  expect(await subject.readDeltaFiles('root', '.myignore.yaml')).toMatchSnapshot()
}))

it('writeIgnoreFiles', apply(async () => {
  await subject.writeIgnoreFiles(
    'root/.myignore',
    'root/container',
    '.myignore.yaml'
  )

  snap(await fsTreeUtils.read.nested('root'))

  snap(
    Object
      .entries((await fsTreeUtils.read.flat('root')).fileContents)
      .map(([name, content]) => ({name, content}))
      .filter(x => /\.myignore$/.test(x.name))
      .map(({name, content}) => [{name}, {content}])
  )
}))
