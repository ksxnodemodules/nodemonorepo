import {spawn, ChildProcess} from 'child_process'
import assert from 'static-type-assert'
import spawnAsync, {core, main, SpawnFactory} from '../../index'

assert<typeof spawnAsync>(main)

assert<
  SpawnFactory<ChildProcess>
>(spawnAsync('echo'))

assert<
  ChildProcess
>(spawnAsync('echo').process)

assert<
  Promise<SpawnFactory.TerminationInformation<ChildProcess>>
>(spawnAsync('echo').onclose)

assert<
  SpawnFactory<ChildProcess>
>(core(spawn, 'echo'))

assert<
  ChildProcess
>(core(spawn, 'echo').process)

assert<
  Promise<SpawnFactory.TerminationInformation<ChildProcess>>
>(core(spawn, 'echo').onexit)
