function splitOnce (
  text: string,
  separator: string
): [string, string] | [string] {
  const [first, ...rest] = text.split(separator)
  return rest.length ? [first, rest.join(separator)] : [first]
}

export = splitOnce
