# unique-temp-path

Create temporary directory/file names that are unique

## Requirements

* Node.js ≥ 8.9.0

## Why?

There're always files/directories being added to temporary directory. There's a chance, albeit rather small, that a random string would collapse with them. For this reason, it is necessary to check whether that random name exists.

## Usage

### Function Signature

```typescript
declare function tempPath (prefix?: string, suffix?: string): string
```

### Example

```javascript
import tempPath from 'unique-temp-path'
import fs from 'fs'
const filename = tempPath('myprefix', 'mysuffix')
fs.writeFileSync(filename, 'This is temporary')
```

A file with name of `myprefix{{random string}}mysuffix` would be created.

## License

[MIT](https://git.io/vhaEz) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
