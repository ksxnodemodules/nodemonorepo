import {spawnSync} from 'child_process'
import snapSpawn from '../../lib/snap-spawn'

describe('passing functions', () => {
  it('executes echo', () => snapSpawn(
    (argv, options) => {
      expect({
        arguments: {argv, options}
      }).toMatchSnapshot()

      return spawnSync('echo', argv, options)
    },
    ['Hello, World!!'],
    {encoding: 'utf8'}
  )())

  it('executes node', () => snapSpawn(
    (argv, options) => {
      expect({
        arguments: {argv, options}
      }).toMatchSnapshot()

      return spawnSync('node', argv, options)
    },
    [],
    {
      input: 'console.log({abc: 123, def: 456})'
    }
  )())
})

describe('passing command', () => {
  it(
    'executes echo',
    snapSpawn.withCommand('echo', ['Hello, World!!'])
  )

  it(
    'executes node',
    snapSpawn.withCommand('node', [], {input: 'console.log({abc: 123, def: 456})'})
  )
})
