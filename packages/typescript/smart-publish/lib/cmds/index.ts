import semver from 'semver'
import createTags from '../tags'

function createCommands (name: string, version: string): createCommands.Result {
  const parseResult = semver.parse(version)

  if (!parseResult) {
    throw new SyntaxError(`Cannot parse ${JSON.stringify(version)} in semver format`)
  }

  const { prerelease } = parseResult
  const [first, second, ...tagsRest] = createTags(prerelease[0])

  if (second) {
    const firstCmd: createCommands.SingleTagSole = ['publish', '--tag', first]

    const restCmd = [second, ...tagsRest]
      .map((tag): createCommands.MultiTagsRest => ['dist-tag', 'add', `${name}@${version}`, tag])

    return [firstCmd, ...restCmd]
  }

  if (first) {
    return [['publish', '--tag', first]]
  }

  return [['publish']]
}

namespace createCommands {
  export type Result = NoTags | SingleTag | MultiTags
  export type NoTags = [['publish']]
  export type SingleTag = [SingleTagSole]
  export type SingleTagSole = ['publish', '--tag', string]
  export type MultiTags = [SingleTag[0], ...MultiTagsRest[]]
  export type MultiTagsRest = ['dist-tag', 'add', string, string]
}

export = createCommands