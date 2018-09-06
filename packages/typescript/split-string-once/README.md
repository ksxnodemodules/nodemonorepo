# split-string-once

Split a string only once

## Requirements

* Node.js ≥ 8.9.0

## Usage

```javascript
const splitOnce = require('split-string-once')
const a = splitOnce('abc,def,ghi', ',') // ['abc', 'def,ghi']
const b = splitOnce('abcdefghi', ',') // ['abc,def,ghi']
console.log({a, b})
```

## License

[MIT](https://git.io/vhaEz) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
