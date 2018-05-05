import subject from './index'

const params = [
  'echo seg0 no0',
  'echo seg0 no1',
  'echo seg0 no2',
  'echo seg0 no3',
  'echo seg1 no0',
  'echo seg1 no1',
  'echo seg1 no2',
  'echo seg1 no3',
  'echo seg2 no0',
  'echo seg2 no1',
  'echo seg2 no2',
  'echo seg2 no3',
  'echo seg3 no0', // remaining
  'echo seg3 no1'
]

it('async iterator matches snapshot', async () => {
  const list = Array<ReadonlyArray<subject.ResultItem>>()

  for await (const item of subject(params, 4)) {
    list.push(item)
  }

  const sample = sortSegment(list)
  expect(sample).toMatchSnapshot()
})

it('array matches snapshot', async () => {
  const sample = sortSegment(await subject.asArray(params, 4))
  expect(sample).toMatchSnapshot()
})

function getStringFromChunks (chunks: subject.ResultItem.DataChunkList): string {
  return chunks.map(x => String(x)).join('').trim()
}

function convertResultItem (item: subject.ResultItem) {
  class Result {
    readonly status = item.status
    readonly signal = item.signal
    readonly stdout = getStringFromChunks(item.stdout)
    readonly stderr = getStringFromChunks(item.stderr)
  }

  return new Result
}

function sortSegment (item: subject.asArray.ReturningValue) {
  return item.map(
    part => part
      .map(convertResultItem)
      .sort((a, b) => a.stdout > b.stdout ? 1 : -1)
  )
}
