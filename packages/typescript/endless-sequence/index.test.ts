import create from './index'

it('matches snapshot', () => {
  const generate =
    (previous: ReadonlyArray<string>) => previous
      .map(x => previous.map(y => x + y))
      .reduce((prev, current) => [...prev, ...current])

  const getData = () => seq.__internal.data

  const collect = (count: number) => {
    const collection = Array<string>()

    for (const element of seq) {
      if (!count) break
      --count
      collection.push(element)
    }

    return collection
  }

  const seq = create(generate, 'abcdef')
  const first = getData()

  const at2 = seq.at(2)
  const second = getData()

  const at6 = seq.at(6)
  const third = getData()

  const collection20 = collect(20)
  const forth = getData()

  const collection64 = collect(64)
  const fifth = getData()

  expect([
    {data: first},
    {at2, data: second},
    {at6, data: third},
    {collection20, data: forth},
    {collection64, data: fifth}
  ]).toMatchSnapshot()
})
