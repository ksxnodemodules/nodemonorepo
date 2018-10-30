function tags (suffix?: string): ReadonlySet<string> {
  if (!suffix) return new Set()
  const matches = /^[a-zA-Z]+/.exec(suffix)
  if (!matches) return new Set(['prerelease'])
  const [tag] = matches
  return new Set([tag, 'prerelease'])
}

export = tags
