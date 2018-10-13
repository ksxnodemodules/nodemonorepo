# advanced-map-mutable-multi-key

Map-like class using mutable arrays as keys

## Usage

```javascript
import MutableMultiKey from 'advanced-map-mutable-multi-key'
const map = new MutableMultiKey(Map)

const key = [0]
map.set(key, 'value')

map.get([0]) // expect: 'value'
map.get([1]) // expect: undefined
map.get(key) // expect: 'value'

key[0] = 1

map.get([0]) // expect: undefined
map.get([1]) // expect: 'value'
map.get(key) // expect: 'value'
```

## License

[MIT](https://git.io/vhaEz) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
