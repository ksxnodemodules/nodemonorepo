# extra-jest

Some extra functions to work with jest testing framework

## Requirements

* Node.js ≥ 8.9.0

## APIs

**NOTE:**
  * `xjest` is an alias of module `extra-jest`
  * `jsYaml` is an alias of module `js-yaml`
  * `fsTreeUtils` is an alias of module `fs-tree-utils`

### `xjest.snap.mkfn`

```typescript
type DumpFunction<X> = (x: X, options?: jsYaml.DumpOptions) => string
type TestFunction<X> = (x: X, options?: jsYaml.DumpOptions) => () => void

declare function mkfn<X> (fn: DumpFunction<X>, defaultOptions?: jsYaml.DumpOptions): TestFunction<X>
```

This function is used to created `xjest.snap.*` functions below.

### `xjest.snap.*`

```typescript
declare function unsafe (x: any, options?: jsYaml.DumpOptions): () => void
declare function safe (x: any, options?: jsYaml.DumpOptions): () => void
declare function pureSafe (x: any, options?: jsYaml.DumpOptions): () => void
declare function pureUnsafe (x: any, options?: jsYaml.DumpOptions): () => void
declare function noRefs (x: any, options?: jsYaml.DumpOptions): () => void
```

Create jest snapshots but in YAML format.

**Features:**
  * `xjest.snap.unsafe` dumps JavaScript objects before writing to snapshot.
  * `xjest.snap.safe` safely dumps JavaScript objects before writing to snapshot.
  * `xjest.snap.pureUnsafe` is `xjest.snap.unsafe` without default options.
  * `xjest.snap.pureSafe` is `xjest.snap.safe` without default options.
  * `xjest.snap.noRefs` is `xjest.snap.unsafe` with self references.

**Default Options:**

```typescript
namespace defaultOptions {
  export const skipInvalid = true
  export const sortKeys = true
  export const noRefs = false
  export const noCompatMode = true
}
```

### `xjest.setupTeardown.base.createFactory`

```typescript
type PromiseFunc<X, Y> = (x: X) => Promise<Y>
type SyncFunc<X, Y> = (x: X) => Y
type SetupFunc<Y> = () => Promise<Y>
type TeardownFunc<X> = (x: X) => Promise<void>
type CalledFunc<X, Y> = PromiseFunc<X, Y>
type SyncCalledFunc<X, Y> = SyncFunc<X, Y>
type Tester = () => Promise<void>
type AsyncTesterFactory<SM, MT> = (fn: CalledFunc<SM, MT>) => Tester
type SyncTesterFactory<SM, MT> = (fn: SyncCalledFunc<SM, MT>) => Tester

interface Config<SY, TX> {
  readonly setup: SetupFunc<SY>
  readonly teardown: TeardownFunc<TX>
}

type TesterFactory<SM, MT> = AsyncTesterFactory<SM, MT> & {
  forAsync: AsyncTesterFactory<SM, MT>,
  forSync: SyncTesterFactory<SM, MT>
}

declare function createFactory<SM, MT> (config: Config<SM, MT>): TesterFactory<SM, MT>
```

Creates a `TesterFactory<SM, MT>` from a `config: Config<SM, MT>`.

**Parameters:**
  * `config.setup`: A function that runs before main test.
  * `config.teardown`: A function that runs after main test.

**Returns:**
  * A `TesterFactory<SM, MT>` is both a namespace and a function, it has the same effect as `TesterFactory<SM, MT>::forAsync`.
  * A `TesterFactory::forAsync` is a function, it creates a `Tester` from `fn: CalledFunc<SM, MT>`.
  * A `TesterFactory::forSync` is a function, it creates a `Tester` from `fn: SyncCalledFunc<SM, MT>`.
  * A `Tester` can be passed into jest `test` functions as a test function (second argument).

**Aliases:**
  * `xjest.setupTeardown.createFactory`
  * `xjest.setupTeardown.default`

### `xjest.setupTeardown.virtualEnvironment.createFactory`

```typescript
interface Info {
  readonly tree: Tree.Write.Node
  readonly container: string
  readonly previousWorkingDirectory: string
}

interface Factory {
  readonly info: Info
  readonly apply: base.TesterFactory<Info, void>
}

declare function createFactory (tree: fsTreeUtils.Tree.Write.Node, container?: string): Factory
```

**Parameters:**
  * `tree`: Specifies directory structure of target directory.
  * `container` (optional): Intended target directory, default to random name in `os.tmpdir()` folder.

**Returns:**
  * `Factory::info`: Contains some information that might be useful (see `interface Info`).
  * `Factory::apply`: Takes an async function and returns a `Tester`.

### `xjest.snapSpawn.snap`

```typescript
type SpawnFunc = (argv: string[], options: SpawnSyncOptions) => SpawnSyncReturns<string | Buffer>
declare function snap (fn: SpawnFunc, argv?: string[], options?: SpawnSyncOptions): () => void
```

Create a function that creates a snapshot from result of process execution.

**Parameters:**
  * `fn`: A function that calls `spawnSync`.
  * `argv` (optional): Additional arguments.
  * `options` (optional): Options to pass to `spawnSync`.
  * `snap` (optional): Snap function to use.

**Returns:**
  * A function that makes snapshots from process execution result.

**Aliases:**
  * `xjest.snapSpawn.snap.default`

### `xjest.snapSpawn.snap.withCommand`

Like `xjest.snapSpawn.snap` above but with `command: string` as the first parameter instead of `fn: SpawnFunc`.

## License

[MIT](https://git.io/vhaEz) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
