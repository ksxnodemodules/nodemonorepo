# restricted-concurrent-actions

Like `Promise.all`, but limit number of concurrent promises

## Usage

### Function Signature

```typescript
declare function restrictedConcurrentActions<Y> (
  actions: Iterable<() => Promise<Y>>,
  partLength: number,
  handleRemain?: (tray: Y[]) => Y[]
): AsyncIterableIterator<Y[]>

declare namespace restrictedConcurrentActions {
  declare function asArray<Y> (
    actions: Iterable<() => Promise<Y>>,
    partLength: number,
    handleRemain?: (tray: Y[]) => Y[]
  ): Promise<Y[][]>
}
```

### Examples

#### Fetch 4 URLs at a time

```javascript
import rca from 'restricted-concurrent-actions'
import fetch from 'node-fetch'

const resources = [ /* An array of URLs */ ]
const actions = resources.map(url => () => fetch(url))
const partLength = 4

const result = await rca.asArray(actions, partLength)
console.log(result)
```

## License

[MIT](https://git.io/vhaEz) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
