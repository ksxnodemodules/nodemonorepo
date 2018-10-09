# advanced-map-initialized

Map-like class with default values

## Usage

```javascript
import Initialized from 'advanced-map-initialized'
const map = new Initialized(Map, x => String(x))
map.get(0) // expect: '0'
map.set(0, 'zero')
map.get(0) // expect: 'zero'
```

## License

[MIT](https://git.io/vhaEz) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
