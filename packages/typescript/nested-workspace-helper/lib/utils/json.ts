export type Serialized = object | any[] | string | number | null
export type Deserialized = string
export type Indentation = string | number

export function serialize (json: Deserialized): Serialized {
  return JSON.parse(json)
}

export function deserialize (
  object: Serialized,
  indent: Indentation = 2,
  finalNewLine = 1
): Deserialized {
  return JSON.stringify(object, undefined, indent) + '\n'.repeat(finalNewLine)
}
