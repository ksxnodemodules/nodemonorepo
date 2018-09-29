import * as subject from '../lib/setup-teardown'

it('subject matches snapshot', () => {
  expect(subject).toMatchSnapshot()
})

describe('trackedData', () => {
  const initialTrackedData = 'Initial'
  const newTrackedData = 'New'
  let trackedData = initialTrackedData

  const createHistoryRecorder = (history: any[]) =>
    (step: 'setup' | 'teardown' | 'main') =>
      history.push({ trackedData, step })

  it('changes when invoking setup-teardown asynchronously', async () => {
    let history: any[] = []
    const record = createHistoryRecorder(history)

    const setup = async () => {
      record('setup')
      trackedData = newTrackedData
    }

    const teardown = async () => {
      record('teardown')
      trackedData = initialTrackedData
    }

    const main = async () => {
      record('main')
    }

    await subject.base.createFactory<void, void>({ setup, teardown }).forAsync(main)()
    expect(trackedData).toBe(initialTrackedData)
    expect({ history }).toMatchSnapshot()
  })

  it('changes when invoking setup-teardown synchronously', async () => {
    let history: any[] = []
    const record = createHistoryRecorder(history)

    const setup = async () => {
      record('setup')
      trackedData = newTrackedData
    }

    const teardown = async () => {
      record('teardown')
      trackedData = initialTrackedData
    }

    const main = () => {
      record('main')
    }

    await subject.base.createFactory<void, void>({ setup, teardown }).forSync(main)()
    expect(trackedData).toBe(initialTrackedData)
    expect({ history }).toMatchSnapshot()
  })

  it('stays unchanged when not invoking setup-teardown', () => {
    expect(trackedData).toBe(initialTrackedData)
  })
})
