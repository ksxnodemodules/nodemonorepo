# fs-tree-utils

Work with filesystem tree with ease

## APIs

**NOTE:**
  * `fsTreeUtils` is an alias of module `fs-tree-utils`.
  * `fsExtra` is an alias of module `fs-extra`.
  * `fs` is an alias of module `fs`.
  * All example code snippets are in async context.

### `fsTreeUtils.traverse`

```typescript
declare function traverse (dirname: string, options?: Options): Promise<DeepFuncParam[]>

interface Options {
  readonly deep?: DeepFunc
  readonly level?: number
  readonly stat?: StatFunc
}

interface DeepFuncParam {
  readonly container: string
  readonly item: string
  readonly path: string
  readonly stats: fsx.Stats
  readonly level: Level
}

type DeepFunc = (param: DeepFuncParam) => boolean
type Stat = (path: string) => fs.Stats | Promise<fs.Stats>

// See https://git.io/vhar7 for more types
```

**Parameters:**
  * `dirname`: Directory that contains all items need to be iterated over.
  * `options.deep` (optional): Decides whether or not to dive deeper, default to "always".
  * `options.level` (optional): Initial level of depth, default to `0`.
  * `options.stat` (optional): Return filesystem item's stats (`fs.Stats`), default to `fs.stat`.

**Returns:**
  * A promise of `DeepFuncParam[]`

**Other types:**
  * `DeepFuncParam::container`: Path to directory that contains each item.
  * `DeepFuncParam::item`: Name (basename) of each item (including extension).
  * `DeepFuncParam::path`: Full path to each item.
  * `DeepFuncParam::stats`: Returned value of `options.stat` upon each item.
  * `DeepFuncParam::level`: Level of depth, minimum depth is customizable via `options.level`.

#### Examples

##### Simplest form

```javascript
import {traverse} from 'fs-tree-utils'
const res = await traverse('/path/to/my/directory')
console.log('all basenames', x => x.item)
console.log('all last changes', x => x.stats.mtime)
console.log('all fullpaths', x => x.path)
```

##### Get all symbolic links

This example requires `fsExtra.lstat`/`fs.lstatSync` in order to detect symbolic links. This is also safer methods when there're recursive links.

```javascript
import {traverse} from 'fs-tree-utils'
import {lstatSync} from 'fs' // you can also use `fsExtra.lstat` for true async operation
const res = await traverse('/path/to/my/directory', {stat: lstatSync})
const links = res.filter(x => x.stats.isSymbolicLink()).map(x => x.path)
console.log('all symlinks', links)
```

##### With specified `deep`

Don't traverse `.git`'s/`node_modules`'s children.

```javascript
import {traverse} from 'fs-tree-utils'
const deep = ({item}) => item !== '.git' && item !== 'node_modules'
const res = await traverse(`/path/to/my/directory`, {deep})
console.log('result', res)
```

### `fsTreeUtils.read.nested`

```typescript
declare function readNested (name: string, options?: NestedReadOptions): Promise<Tree.Read.Node>

interface NestedReadOptions {
  readonly stat?: NestedReadOptions.StatFunc
  readonly onerror?: NestedReadOptions.ErrorHandler
  readonly onunknown?: NestedReadOptions.UnknownHandler
}

// See https://git.io/vhar7 for more types
```

**Parameters:**
  * `name`: Path to the top directory of a tree.
  * `options.stat` (optional): Stat function to use (returns either `fs.Stats` or `Promise<fs.Stats>`), default to `fs.stat`.
  * `options.onerror` (optional): Function that transforms an error into an instance of `fsTreeUtils.Exception.ErrorCarrier`, these errors will be thrown instead if the function is not provided.
  * `options.onunknown` (optional): Function that creates an instance of `fsTreeUtils.Exception.Other` when encounter unknown filesystem entity, errors would be thrown instead if the function is not provided.

#### Examples

##### Simplest form

```javascript
import {read} from 'fs-tree-utils'
const tree = await read.nested('/path/to/my/directory')
console.log('Structure of "/path/to/my/directory"', tree)
```

##### With specified `options.stat`

Use `fsExtra.lstat` as `options.stat`.

```javascript
import {read} from 'fs-tree-utils'
import {lstat} from 'fs-extra' // function lstat (path: string): Promise<fs.Stats>
const tree = await read.nested('/path/to/my/directory', {stat: lstat})
console.log('Structure of "/path/to/my/directory"', tree)
```

### `fsTreeUtils.read.flat`

```typescript
declare function readFlat (name: string, options?: Traverse.Options): Promise<FlatReadResultValue[]>

interface FlatReadResultValue {
  readonly fileContents: FlatReadResultFileContent
  readonly directories: string[]
  readonly files: string[]
  readonly all: string[]
}

interface FlatReadResultFileContent {
  readonly [filename: string]: Tree.Read.FileContent
}

// See https://git.io/vhar7 for more types
```

This function uses `traverse` under the hook.

**Parameters:**
  * `name`: Path to the top directory.
  * `options` (optional): Options to pass to `traverse`.

**Returns:**
  * `FlatReadResultValue::fileContents`: A dict (`Object`) with keys being files' paths (`string`) and values being files' content (`Buffer | string`).
  * `FlatReadResultValue::directories`: A list (`Array`) of directories' paths (`string`).
  * `FlatReadResultValue::files`: A list (`Array`) of files' paths (`string`).
  * `FlatReadResultValue::all`: A list (`Array`) of every item's path (`string`).

### `fsTreeUtils.create`

```typescript
declare function create (tree: Tree.Write, container: string): Promise<void>

// `Tree.Write` is basically tree-like dictionary, see https://git.io/vhar7 for its definition
```

**Parameters:**
  * `tree`: Intended tree structure representation.
  * `container`: Intended top-level directory.

**Returns:**
  * A promise that resolves when tree creation is finishes successfully and rejects when tree creation fails.

**Effects:**
  * Populate directory of `container` with filesystem entities that as represented in `tree`.

#### Examples

##### Tree Creation

```javascript
import {
  create,
  FileSystemRepresentation
} from 'fs-tree-utils'

import {
  writeFile,
  writeFileSync
} from 'fs-extra'

const tree = { // top-level `tree` object corresponds to top-level directory of `container` (directory)
  files: { // corresponding path: {container}/files/ (directory)
    'string.txt': 'A string', // corresponding path: {container}/files/string.txt (file)
    'buffer.txt': Buffer.from('A buffer'), // corresponding path: {container}/files/buffer.txt (file)
    'class.txt': new FileSystemRepresentation.File('File class'), // corresponding path: {container}/files/class.txt (file)
    'function.async.txt': name => writeFile(name), // corresponding path: {container}/files/function.async.txt
    'function.sync.txt': name => writeFileSync(name) // corresponding path: {container}/files/function.sync.txt
  },
  symlinks: { // corresponding path: {container}/symlinks
    'to-files-container': new FileSystemRepresentation.Symlink('../files'), // points to {container}/files/
    'to-nowhere': new FileSystemRepresentation.Symlink('/this/is/nowhere'), // points to /this/is/nowhere
    'a-windows-junction': new FileSystemRepresentation.Symlink('C:\\Windows', {type: 'junction'}) // this is a junction (in Windows)
  },
  clones: { // corresponding path: {container}/clones
    'my-copy': new FileSystemRepresentation.Clone('/source/for/copying') // uses `fsExtra.copy` under the hook
  }
}
```

### `fsTreeUtils.FileSystemRepresentation`

```typescript
abstract class FileSystemRepresentation {
  abstract public write (target: string, param: CreateSecondParam): Promise<void> | void
}

interface CreateSecondParam {
  create (tree: Tree.Write, container: string): Promise<void>
}
```

This is an abstract class upon which `fsTreeUtils.FileSystemRepresentation.*` was built.

#### `fsTreeUtils.FileSystemRepresentation::write`

This is an abstract method.

This method is used by `fsTreeUtils.create`.

**Parameters:**
  * `target`: Name of represented entity.
  * `param.create`: It is `fsTreeUtils.create`.

**Returns:**
  * Synchronous version returns nothing (i.e. `void` a.k.a. `undefined`).
  * Asynchronous version returns a promise that resolves `undefined`.

### `fsTreeUtils.FileSystemRepresentation.File`

```typescript
class File extends FileSystemRepresentation {
  public constructor (content: string | Buffer)
  public write (filename: string): Promise<void>
}
```

#### `fsTreeUtils.FileSystemRepresentation.File::constructor`

**Parameters:**
  * `content`: Intended file's content (`string | Buffer`).

#### `fsTreeUtils.FileSystemRepresentation.File::write`

**Parameters:**
  * `filename`: Intended file's name (`string`).

**Returns:**
  * A promise that resolves when content is written into file successfully.

**Effects:**
  * Write `content` into file with name `filename`.

### Other types and classes

See [module `fs-tree-utils/lib/.types`](https://git.io/vhar7).
