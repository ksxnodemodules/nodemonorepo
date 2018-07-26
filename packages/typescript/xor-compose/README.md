# xor-compose

Compose multiple functions by `XOR`

## Requirements

* Node.js ≥ 8.9.0

## Usage

```javascript
import compose from 'xor-compose'

const a = () => 123
const b = string => string.length
const c = string => [...string].map(x => x.charCodeAt()).reduce((a, b) => a + b)

const fn = compose(a, b, c)
console.log(fn('abc'))
```

## License

[MIT](https://git.io/vhaEz) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
