# clean-typescript-build

Simple TypeScript build cleaning tool

## Feature

* Delete TypeScript compilation products if correspding TS source file is detected.

## Requirements

* Node.js ≥ 8.9.0

## APIs

### `clean`

```typescript
declare function clean (root: string, options?: Options): Promise<clean.Result>
```

**Parameters:**
  * `root`: Path to the directory that contains source files.
  * `options.deep` (optional): Decides whether or not to dive deeper, default ignores `node_modules`.
  * `options.isSource` (optional): Decides whether or not a file is a source, default chooses files with extensions of `.ts` or `.tsx`.
  * `options.listTargets` (optional): List corresponding build products of given source file.

**Returns:**
  * A promise of `clean.Result`.
  * `clean.Result::targets` is a list of all targeted files.
  * `clean.Result::reports` is a list of reports regarding deletion of targeted files.
  * `clean.Result::success` is a list of files that are successfully deleted, ideally equal to `clean.Result::targets`.
  * `clean.Result::failure` is a list of files that are targeted but failed to delete, ideally equal to `[]`.

**Effects:**
  * Delete TypeScript compilation products if correspding TS source file is detected.

### `listAllTargets`

```typescript
declare function listAllTargets (root: string, options?: Options): Promise<ReadonlyArray<string>>
```

**Parameters:**
  * Same as [`clean`](#clean)'s.

**Returns:**
  * A list of targeted files.

## CLIs

```
clean-typescript-build <directory> [options]

Clean TypeScript compilation products

Options:
  --version     Show version number                                    [boolean]
  --help        Show help                                              [boolean]
  --directory   Directory that contains source files                    [string]
  --dry, -u     List files without deletion           [boolean] [default: false]
  --format, -f  Format of output to be printed to stdout
                             [choices: "text", "json", "none"] [default: "text"]
  --jsonIndent  JSON indentation when --format=json        [number] [default: 2]
```

## License

[MIT](https://git.io/vhaEz) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
