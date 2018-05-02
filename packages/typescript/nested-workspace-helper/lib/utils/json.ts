import * as yaml from 'js-yaml'

export type Serialized = object | any[] | string | number | null
export type Deserialized = string
export type Indentation = string | number

export function serialize (json: Deserialized): Serialized {
  return yaml.safeLoad(json)
}

export function deserialize (
  object: Serialized,
  indent: Indentation = 2,
  finalNewLine = 1
): Deserialized {
  return JSON.stringify(object, undefined, indent) + '\n'.repeat(finalNewLine)
}
