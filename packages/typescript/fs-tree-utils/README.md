# fs-tree-utils

Work with filesystem tree with ease

## APIs

**NOTE:**
  * `fsTreeUtils` is an alias of module `fs-tree-utils`.
  * `fsExtra` is an alias of module `fs-extra`.
  * `fs` is an alias of module `fs`.

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
```

**Parameters:**
  * `dirname`: Directory that contains all items need to be iterated over.
  * `options.deep` (optional): Decides whether or not to dive deeper, default to "always".
  * `options.level` (optional): Initial level of depth, default to `0`.
  * `options.stat` (optional): Return filesystem item's stats (`fs.Stats`), default to `fs.stat`.

**Returns:**
  * A promise of `DeepFuncParam[]`

**Other types:**
  * `DeepFuncParam::container`: Path to directory that contains current item.
