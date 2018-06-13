# ancestor-directories

Iterate over all parent directories of a given path

## Requirements

* Node.js ≥ 8.9.0

## APIs

### Function Signature

```typescript
declare function allAncestorDirectories (path: string): IterableIterator<string>
```

### Example

```javascript
import process from 'process'
import {allAncestorDirectories} from 'ancestor-directories'

const ancestors = [...allAncestorDirectories(process.cwd())]
console.log('All ancestors of cwd', ancestors)
```

## License

[MIT](https://git.io/vhaEz) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
