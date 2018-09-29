import parse, { Type } from '../../../../index'

type Sample<X extends Type = Type> = [X, ReadonlyArray<string>]

const samples: ReadonlyArray<Sample> = [
  [Type.Semver, [
    '0.1.2',
    '=0.1.2',
    '~0.1.2',
    '^0.1.2',
    '*'
  ]],
  [Type.Tarball, [
    'ftp://example.com/example.tgz',
    'ftps://example.com/example.tgz',
    'ftp://example.com/example.tar.gzip',
    'ftps://example.com/example.tar.gzip',
    'http://example.com/example.tgz',
    'https://example.com/example.tgz',
    'http://example.com/example.tar.gzip',
    'https://example.com/example.tar.gzip'
  ]],
  [Type.Git, [
    'git://example.com/org/repo.git#v0.1.2',
    'git+ssh://git@example.com:org/repo.git#v0.1.2',
    'git+ssh://git@example.com:org/repo#semver:^5.0',
    'git+http://user@example.com/org/repo.git',
    'git+https://user@example.com/org/repo.git',
    'git+file:../../hello/world'
  ]],
  [Type.GitHub, [
    'org/repo',
    'org/repo#hash',
    'org/repo#hash/tag',
    'org-name/repo-name',
    'org-name/repo-name#commit-hash',
    'org-name/repo-name#commit-hash/tag-name',
    'org_name/repo_name',
    'org_name/repo_name#commit_hash',
    'org_name/repo_name#commit_hash/tag_name',
    'org.name/repo.name',
    'org.name/repo.name#commit.hash',
    'org.name/repo.name#commit.hash/tag.name',
    'org123/repo456',
    'org123/repo456#hash789',
    'org123/repo456#hash789/tag',
    'Org/Repo',
    'Org/Repo#Hash',
    'Org/Repo#Hash/Tag',
    'ORG/REPO',
    'ORG/REPO#HASH',
    'ORG/REPO#HASH/TAG'
  ]],
  [Type.Local, [
    'file:///home/user/package',
    'file:../../hello/world,',
    'link:///home/user/package',
    'link:../../hello/world,'
  ]],
  [Type.Latest, [
    'latest'
  ]],
  [Type.Unknown, [
    '!@#$%^&*()',
    'blahblah'
  ]]
]

describe('when using samples', () => {
  const results = samples.map(([type, array]) => {
    const table = array.map(input => ({
      input,
      output: parse(input)
    }))

    return { type, table }
  })

  it('emits correct types', () => {
    const received = results.map(({ table }) => table.map(({ input, output }) => ({ input, type: output.type })))
    const expected = results.map(({ table, type }) => table.map(({ input }) => ({ input, type })))
    expect(received).toEqual(expected)
  })

  it('emits correct values', () => {
    const received = results.map(x => x.table.map(({ input, output }) => ({ input, value: output.value })))
    const expected = results.map(x => x.table.map(({ input }) => ({ input, value: input })))
    expect(received).toEqual(expected)
  })

  it('matches snapshot', () => {
    expect(results).toMatchSnapshot()
  })
})
