# parse-dependency-range

Parse dependency source/version

## Requirements

* Node.js ≥ 8.9.0

## Usage

### Syntax

```javascript
import parse from 'parse-dependency-range'
const struct = parse('^0.1.2') // { type: 'semver', value: '^0.1.2', ... }
```

### Overview

Function `parse` takes a string (which is value of each dependency in field `dependencies` in your `package.json`) and returns an object called `struct` (of interface `Struct` in TypeScript).

There're 7 subtypes of `Struct` corresponding to 7 syntaxes of input string. All subtypes of `Struct` share a common set of properties: `type` and `value`; `type` is a constant dictates which subtype a `Struct` falls into, `value` is input string.

* `Struct.Semver`: When input string is a version range.
  * `type = 'semver'`
  * `value: string`
  * `range: string` is value of `semver.validRange(value)`

* `Struct.Tarball`: When input string is an URL to a tarball archive.
  * `type = 'tarball'`
  * `value: string`
  * `url: URL` is value of `url.parse(value)`
  * `url.extension: string` is tarball extension

* `Struct.Git`: When input string is an URL to a git repo (must have `git:` or `git+...:` as protocol).
  * `type = 'git'`
  * `value: string`
  * `url: URL` is value of `url.parse(value)`

* `Struct.GitHub`: When input string is a GitHub shorthand (`org/repo` or `org/repo#hash`).
  * `type = 'github'`
  * `value: string`
  * `org: string` is name of organization or user that owns the repository
  * `repo: string` is name of the repository
  * `hash?: string` is either a commit hash, git branch or git tag

* `Struct.Local`: When input string is pointing to a local directory (begins with `file:` or `link:`).
  * `type = 'local'`
  * `value: string`
  * `path: string` is path to the directory
  * `protocol: string` is either `file:` or `link:`

* `Struct.Latest`: When input string is litterally `'latest'`.
  * `type = 'latest'`
  * `value = 'latest'`

* `Struct.Unknown`: When input string doesn't fit any of aformentioned syntaxes.
  * `type = 'unknown'`
  * `value: string`

## License

[MIT](https://git.io/vhaEz) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
