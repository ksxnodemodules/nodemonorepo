function tags (suffix?: string | number): ReadonlySet<string> {
  if (typeof suffix === 'undefined') return new Set()
  const matches = /^[a-zA-Z]+/.exec(String(suffix))
  if (!matches) return new Set(['prerelease'])
  const [tag] = matches
  return new Set([tag, 'prerelease'])
}

export = tags
