# advanced-set-mutable-multi-key

Set-like class using mutable arrays as keys

## Usage

```javascript
import MutableMultiKey from 'advanced-set-mutable-multi-key'
const set = new MutableMultiKey(Map)

const element = [0]
set.add(element)
set.has([0]) // expect: true
set.has([1]) // expect: false

element[0] = 1
set.has([0]) // expect: false
set.has([1]) // expect: true
```

## License

[MIT](https://git.io/vhaEz) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
