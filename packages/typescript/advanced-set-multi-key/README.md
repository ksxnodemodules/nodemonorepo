# advanced-set-multi-key

Set-like class using multi keys

## Usage

```javascript
import MultiKey from 'advanced-set-multi-key'
const set = new MultiKey(Map).add([0, 1, 2])
set.has([0, 1, 2]) // expect: true
set.has([1, 2, 3]) // expect: false
```

## License

[MIT](https://git.io/vhaEz) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
