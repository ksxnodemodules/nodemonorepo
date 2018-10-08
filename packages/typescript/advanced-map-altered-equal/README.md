# advanced-map-altered-equal

Map-like class with customizable equality operator

## Usage

```javascript
import AlteredEqual from 'advanced-map-altered-equal'
const map = new AlteredEqual(Map, (a, b) => String(a) === String(b))
map.set(0, 'zero')
map.get('0') // expect: 'zero'
map.get({ toString: () => '0' }) // expect: 'zero'
```

## License

[MIT](https://git.io/vhaEz) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
