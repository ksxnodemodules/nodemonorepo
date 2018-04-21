import snapSpawn from './.lib/snap-spawn'

describe('help message', () => {
  describe('from global command', () => {
    it('with --help', snapSpawn(['--help']))
    it('without arguments', snapSpawn())
  })

  describe('from version-management', () => {
    it('as version-management', snapSpawn(['version-management']))
    it('as verman', snapSpawn(['verman']))
  })

  it('from version-management/mismatches', snapSpawn(['version-management', 'mismatches']))
})
