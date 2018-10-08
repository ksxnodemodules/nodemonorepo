# advanced-map-altered-equal

Map-like class using multi keys

## Usage

```javascript
import MultiKey from 'advanced-map-multi-key'
const map = new MultiKey(Map)
map.set([0, 1, 2], 'foo')
map.get([0, 1, 2]) // expect: 'foo'
map.get([0]) // expect: undefined
```

## License

[MIT](https://git.io/vhaEz) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
