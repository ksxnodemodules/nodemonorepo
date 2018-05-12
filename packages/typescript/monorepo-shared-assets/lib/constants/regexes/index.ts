export const VERSION = /[0-9]+\.[0-9]+\.[0-9]+(?:-|$)/

export namespace versionRequirement {
  export const ANY = /^(?:\*|x\.x\.x)$/
  export const EQUAL = /^=?[0-9]+\.[0-9]+\.[0-9]+(?:-|$)/
  export const TILDA = /^~[0-9]+\.[0-9]+\.[0-9]+(?:-|$)/
  export const CARET = /^\^[0-9]+\.[0-9]+\.[0-9]+(?:-|$)/
  export const PATCH = /^[0-9]+\.[0-9]+\.x/
  export const MINOR = /^[0-9]+\.x\.x/
  export const MAJOR = /^x\.x\.x/
}
